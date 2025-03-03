"use server"
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

console.log("AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID)
console.log("AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY)
console.log("AWS_REGION", process.env.AWS_REGION)
console.log("AWS_BUCKET_NAME", process.env.AWS_BUCKET_NAME)
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const uploadToS3 = async (buffer: Buffer, type: string) => {
  
    const bucketName = process.env.AWS_BUCKET_NAME!;
    let key;
    if (type === "VIDEO") {
        key = `${crypto.randomUUID()}-${Date.now()}`;
    } else {
        key = `thumbnails/${crypto.randomUUID()}-${Date.now()}`;
    }
    const command = new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer });
    await s3Client.send(command);
    return key;
}

export default uploadToS3;
