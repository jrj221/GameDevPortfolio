"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = require("path");
const crypto_1 = require("crypto");
// ==========================================
// CONFIGURATION
// ==========================================
// The local directory to upload (usually your build output)
const LOCAL_DIR = "dist";
// Your S3 bucket name
const BUCKET_NAME = "jack-johnson-portfolio";
// The sub-folder in S3 to upload to (e.g., "agenda/"). 
// Leave empty if uploading to the root.
const S3_PREFIX = "";
// The region where your bucket is located
const REGION = "us-west-1";
// ==========================================
// INITIALIZATION
// ==========================================
const s3Client = new client_s3_1.S3Client({ region: REGION });
// Map file extensions to correct Content-Type to ensure proper browser behavior
const contentTypeMap = {
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
function getContentType(filename) {
    for (const ext in contentTypeMap) {
        if (filename.endsWith(ext))
            return contentTypeMap[ext];
    }
    return "binary/octet-stream"; // fallback
}
/**
 * Calculates MD5 hex hash of a local file for differential comparison.
 */
async function getLocalMD5(filePath) {
    return new Promise((resolve, reject) => {
        const hash = (0, crypto_1.createHash)("md5");
        const stream = fs.createReadStream(filePath);
        stream.on("data", (data) => hash.update(data));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
}
/**
 * Fetches all objects in the bucket (paginated) to compare with local files.
 */
async function listS3Objects(bucket) {
    const objectMap = new Map();
    let continuationToken = undefined;
    console.log(`🔍 Fetching existing objects from bucket: ${bucket}...`);
    do {
        const command = new client_s3_1.ListObjectsV2Command({
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
async function syncDirectory(localCurrentDir, bucketName, s3Objects, currentPrefix = "") {
    const entries = fs.readdirSync(localCurrentDir);
    let uploadCount = 0;
    let skipCount = 0;
    for (const entry of entries) {
        const fullPath = (0, path_1.join)(localCurrentDir, entry);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            const results = await syncDirectory(fullPath, bucketName, s3Objects, `${currentPrefix}${entry}/`);
            uploadCount += results.uploadCount;
            skipCount += results.skipCount;
        }
        else {
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
                const uploadResponse = await s3Client.send(new client_s3_1.PutObjectCommand(params));
                uploadCount++;
                console.log(`📤 Uploaded ${key} (${contentType}) [HTTP ${uploadResponse.$metadata.httpStatusCode}]`);
            }
            catch (error) {
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
    }
    catch (error) {
        console.error("💥 Critical error during upload:", error);
    }
})();
