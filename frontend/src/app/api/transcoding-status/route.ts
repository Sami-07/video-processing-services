import AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

const docClient = new AWS.DynamoDB.DocumentClient();

export async function GET(request: NextRequest) {
    const jobId = request.nextUrl.searchParams.get('jobId')
    console.log("jobId", jobId)
    const result = await docClient.get({
        TableName: 'TranscodingStatus',
        Key: { jobId }
    }).promise();
    const response = {
        status: result.Item ? result.Item.status : 'Job not found',
    };
    console.log("response", response)
    return NextResponse.json(response)
}