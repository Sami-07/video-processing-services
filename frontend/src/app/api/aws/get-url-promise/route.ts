
import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_S3_REGION,
});

const rawVideoBucket = process.env.AWS_BUCKET_NAME;
const rawThumbnailBucket = process.env.AWS_THUMBNAIL_BUCKET_NAME;
export async function POST(request: Request): Promise<NextResponse> {
  const { fileType, type } = await request.json();

  const key = type === "VIDEO" ? crypto.randomUUID() + ".mp4" : crypto.randomUUID() + ".jpg"
  const params = {
    Bucket: type === "VIDEO" ? rawVideoBucket : rawThumbnailBucket,
    Key: key,
    Expires: 60,
    ContentType: fileType,
  };

  console.log("params", params)
  try {

    const url = await s3.getSignedUrlPromise('putObject', params);
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Error generating signed URL', error);
    return NextResponse.json({ error: 'Error generating signed URL' }, { status: 500 });
  }
}