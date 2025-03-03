"use server"
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const Bucket = process.env.AWS_PRODUCTION_BUCKET_NAME;
export const getAwsUrl = async (key: string) => {
  console.log("key in aws", key);
  if (!key) {
    throw new Error("Missing key");
  }
  try {
    const command = new GetObjectCommand({ Bucket, Key: key });
    const src = await getSignedUrl(s3Client, command);
    console.log("src in aws", src);
    return { src };
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export const getThumbnailAwsUrl = async (key: string) => {
  const command = new GetObjectCommand({ Bucket: process.env.AWS_THUMBNAIL_BUCKET_NAME, Key: key });
  const src = await getSignedUrl(s3Client, command);
  console.log("src in thumbnail aws", src)
  return { src };
}
