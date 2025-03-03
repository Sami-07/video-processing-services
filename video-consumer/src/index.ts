import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import type { S3Event } from "aws-lambda";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
dotenv.config();

const sqsClient = new SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

async function main() {
    const command = new ReceiveMessageCommand({
        QueueUrl: process.env.QUEUE_URL!,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
    });

    while (true) {
        const { Messages } = await sqsClient.send(command);
        if (!Messages || Messages.length === 0) {
            console.log("No messages found");
            continue;
        }
        try {
            for (const message of Messages) {
                const { MessageId, Body } = message;
                console.log("MessageId", MessageId);
                console.log("Body", Body);

                // Validate the message
                if (!Body) {
                    console.log("Invalid message body");
                    continue;
                }
                const event = JSON.parse(Body) as S3Event;
                if ("Service" in event && "Event" in event) {
                    if (event.Event === "s3:TestEvent") continue;
                }
                for (const record of event.Records) {
                    const { s3 } = record;
                    const { bucket, object: {
                        key
                    } } = s3;

                    // Spin up a Docker container
                    const command = new RunTaskCommand({
                        cluster: process.env.CLUSTER_NAME!,
                        taskDefinition: process.env.TASK_DEFINITION!,
                        launchType: "FARGATE",
                        networkConfiguration: {
                            awsvpcConfiguration: {
                                assignPublicIp: "ENABLED",
                                securityGroups: ["sg-01a3f07db3cd9be93"],
                                subnets: ["subnet-074a1a93b8d92d180", "subnet-0b37d7e856b0fbb65", "subnet-078ce503d3520f690"],
                            }
                        },
                        overrides: {
                            containerOverrides: [{
                                name: "video-transcoding-container",
                                environment: [{
                                    name: "BUCKET_NAME",
                                    value: bucket.name
                                }, {
                                    name: "KEY",
                                    value: key
                                }, {
                                    name: "AWS_ACCESS_KEY_ID",
                                    value: process.env.AWS_ACCESS_KEY_ID!
                                }, {
                                    name: "AWS_SECRET_ACCESS_KEY",
                                    value: process.env.AWS_SECRET_ACCESS_KEY!
                                }
                            ]
                            }]
                        }
                    });
                    await ecsClient.send(command);
                    console.log("Bucket", bucket.name);
                    console.log("Object key", key);
                }

                // Delete the message from the queue
                await sqsClient.send(new DeleteMessageCommand({
                    QueueUrl: process.env.QUEUE_URL!,
                    ReceiptHandle: message.ReceiptHandle!
                }));
            }
        } catch (error) {
            console.error("Error processing message", error);
        }
    }
}

main();
