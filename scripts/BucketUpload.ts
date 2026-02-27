import * as fs from "fs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { join } from "path";

const s3Client = new S3Client({ region: "us-west-1" });

const localDir: string = process.argv[2] ?? "dist";
const bucketName: string = "jack-johnson-portfolio";
uploadDirectory(localDir, bucketName);

async function uploadDirectory(localDir: string, bucketName: string, prefix: string = "") {
	const entries: string[] = fs.readdirSync(localDir);

	for (const entry of entries) {
		const fullPath = join(localDir, entry);
		const stats = fs.statSync(fullPath); // Returns info about the file

		if (stats.isDirectory()) {
			await uploadDirectory(fullPath, bucketName, `${prefix}${entry}/`); // Recurse into the next directory
		} else {
			try {
				const key = `${prefix}${entry}`;

				const params = {
					Body: fs.createReadStream(fullPath), // file stream
					Bucket: bucketName, // bucket name
					Key: key, // file name
				};

				const command = new PutObjectCommand(params);
				const response = await s3Client.send(command);

				console.log("File upload successful with ", response.$metadata.httpStatusCode);
			} catch (error) {
				console.log(error);
			}
		}
	}
}
