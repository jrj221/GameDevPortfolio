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
const s3Client = new client_s3_1.S3Client({ region: "us-west-1" });
const localDir = process.argv[2] ?? "dist";
const bucketName = "jack-johnson-portfolio";
uploadDirectory(localDir, bucketName);
async function uploadDirectory(localDir, bucketName, prefix = "") {
    const entries = fs.readdirSync(localDir);
    for (const entry of entries) {
        const fullPath = (0, path_1.join)(localDir, entry);
        const stats = fs.statSync(fullPath); // Returns info about the file
        if (stats.isDirectory()) {
            await uploadDirectory(fullPath, bucketName, `${prefix}${entry}/`); // Recurse into the next directory
        }
        else {
            try {
                const key = `${prefix}${entry}`;
                const params = {
                    Body: fs.createReadStream(fullPath), // file stream
                    Bucket: bucketName, // bucket name
                    Key: key, // file name
                };
                const command = new client_s3_1.PutObjectCommand(params);
                const response = await s3Client.send(command);
                console.log("File upload successful with ", response.$metadata.httpStatusCode);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
