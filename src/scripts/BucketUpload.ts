import * as fs from "fs";
import { S3Client, PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { join } from "path";

const s3Client = new S3Client({ region: "us-west-1" });

const localDir: string = "dist";
const bucketName: string = "jack-johnson-portfolio";

// Map file extensions to correct Content-Type
const contentTypeMap: { [ext: string]: string } = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".ico": "image/x-icon",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
};

function getContentType(filename: string) {
	for (const ext in contentTypeMap) {
		if (filename.endsWith(ext)) return contentTypeMap[ext];
	}
	return "binary/octet-stream"; // fallback
}

async function uploadDirectory(localDir: string, bucketName: string, prefix: string = "") {
	const entries: string[] = fs.readdirSync(localDir);

	for (const entry of entries) {
		const fullPath = join(localDir, entry);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			await uploadDirectory(fullPath, bucketName, `${prefix}${entry}/`);
		} else {
			try {
				const key = `${prefix}${entry}`;
				const contentType = getContentType(key);

				const params = {
					Bucket: bucketName,
					Key: key,
					Body: fs.createReadStream(fullPath),
					ContentType: contentType, // Set the correct Content-Type on upload
				};

				const uploadResponse: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand(params));

				console.log(
					`Uploaded ${key} with Content-Type "${contentType}" (HTTP: ${uploadResponse.$metadata.httpStatusCode})`
				);
			} catch (error) {
				console.error(`Error uploading ${entry}:`, error);
			}
		}
	}
}

// Start upload
uploadDirectory(localDir, bucketName).catch(console.error);
