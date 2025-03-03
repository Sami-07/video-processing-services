import { NextRequest } from "next/server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

export async function GET(request: NextRequest, response: NextResponse) {
    const {searchParams} = new URL(request.url);
    const key = searchParams.get("thumbnailKey");
    if(!key) {
        return NextResponse.json({error: "Missing key"}, {status: 400});
    }
    const command = new GetObjectCommand({ Bucket: process.env.AWS_THUMBNAIL_BUCKET_NAME, Key: key });
    const src = await getSignedUrl(s3Client, command);
    console.log("src in thumbnail aws", src)
    return NextResponse.json(src);
}       