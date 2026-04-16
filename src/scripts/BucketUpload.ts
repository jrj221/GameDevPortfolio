import * as fs from "fs";
import {
	S3Client,
	PutObjectCommand,
	PutObjectCommandOutput,
	ListObjectsV2Command,
	_Object,
} from "@aws-sdk/client-s3";
import { join } from "path";
import { createHash } from "crypto";

// ==========================================
// CONFIGURATION
// ==========================================
// The local directory to upload (usually your build output)
const LOCAL_DIR: string = "dist";

// Your S3 bucket name
const BUCKET_NAME: string = "jack-johnson-portfolio";

// The sub-folder in S3 to upload to (e.g., "agenda/"). 
// Leave empty if uploading to the root.
const S3_PREFIX: string = ""; 

// The region where your bucket is located
const REGION: string = "us-west-1";

// ==========================================
// INITIALIZATION
// ==========================================

const s3Client = new S3Client({ region: REGION });

// Map file extensions to correct Content-Type to ensure proper browser behavior
const contentTypeMap: { [ext: string]: string } = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".mjs": "application/javascript",
	".ico": "image/x-icon",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
	".pdf": "application/pdf",
	".mp4": "video/mp4",
	".mov": "video/quicktime",
	".webm": "video/webm",
	".json": "application/json",
};

function getContentType(filename: string) {
	for (const ext in contentTypeMap) {
		if (filename.endsWith(ext)) return contentTypeMap[ext];
	}
	return "binary/octet-stream"; // fallback
}

/**
 * Calculates MD5 hex hash of a local file for differential comparison.
 */
async function getLocalMD5(filePath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = createHash("md5");
		const stream = fs.createReadStream(filePath);
		stream.on("data", (data) => hash.update(data));
		stream.on("end", () => resolve(hash.digest("hex")));
		stream.on("error", reject);
	});
}

/**
 * Fetches all objects in the bucket (paginated) to compare with local files.
 */
async function listS3Objects(bucket: string): Promise<Map<string, _Object>> {
	const objectMap = new Map<string, _Object>();
	let continuationToken: string | undefined = undefined;

	console.log(`🔍 Fetching existing objects from bucket: ${bucket}...`);

	do {
		const command: ListObjectsV2Command = new ListObjectsV2Command({
			Bucket: bucket,
			ContinuationToken: continuationToken,
		});

		const response = await s3Client.send(command);
		if (response.Contents) {
			for (const obj of response.Contents) {
				if (obj.Key) {
					objectMap.set(obj.Key, obj);
				}
			}
		}
		continuationToken = response.NextContinuationToken;
	} while (continuationToken);

	console.log(`✅ Found ${objectMap.size} existing objects in S3.`);
	return objectMap;
}

/**
 * Recursively walks the local directory and uploads new/changed files.
 */
async function syncDirectory(
	localCurrentDir: string,
	bucketName: string,
	s3Objects: Map<string, _Object>,
	currentPrefix: string = "",
) {
	const entries: string[] = fs.readdirSync(localCurrentDir);
	let uploadCount = 0;
	let skipCount = 0;

	for (const entry of entries) {
		const fullPath = join(localCurrentDir, entry);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			const results = await syncDirectory(fullPath, bucketName, s3Objects, `${currentPrefix}${entry}/`);
			uploadCount += results.uploadCount;
			skipCount += results.skipCount;
		} else {
			try {
				const key = `${currentPrefix}${entry}`;
				const contentType = getContentType(key);

				// Differential Upload check
				const existingObj = s3Objects.get(key);
				if (existingObj) {
					const localMD5 = await getLocalMD5(fullPath);
					// S3 ETag is typically the MD5 hash in quotes
					const s3ETag = existingObj.ETag?.replace(/"/g, "");

					if (existingObj.Size === stats.size && s3ETag === localMD5) {
						skipCount++;
						continue; // Skip upload
					}
				}

				const params = {
					Bucket: bucketName,
					Key: key,
					Body: fs.createReadStream(fullPath),
					ContentType: contentType,
					ContentDisposition: "inline", // Ensure browser displays files (e.g. PDFs, images) instead of downloading
				};

				const uploadResponse: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand(params));
				uploadCount++;

				console.log(
					`📤 Uploaded ${key} (${contentType}) [HTTP ${uploadResponse.$metadata.httpStatusCode}]`,
				);
			} catch (error) {
				console.error(`❌ Error uploading ${entry}:`, error);
			}
		}
	}

	return { uploadCount, skipCount };
}

// ==========================================
// MAIN EXECUTION
// ==========================================
(async () => {
	try {
		// Clean up prefix: remove leading/trailing slashes and ensure it ends with / if not empty
		const cleanPrefix = S3_PREFIX.replace(/^\/+|\/+$/g, "");
		const finalPrefix = cleanPrefix ? `${cleanPrefix}/` : "";

		const s3Objects = await listS3Objects(BUCKET_NAME);
		console.log(`🚀 Starting differential sync to ${BUCKET_NAME}/${finalPrefix}...`);
		
		const { uploadCount, skipCount } = await syncDirectory(LOCAL_DIR, BUCKET_NAME, s3Objects, finalPrefix);
		
		console.log(`\n✨ Sync complete!`);
		console.log(`- Files Uploaded: ${uploadCount}`);
		console.log(`- Files Skipped:  ${skipCount}`);
	} catch (error) {
		console.error("💥 Critical error during upload:", error);
	}
})();
