"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const dotenv_1 = __importDefault(require("dotenv"));
const client_ecs_1 = require("@aws-sdk/client-ecs");
dotenv_1.default.config();
const sqsClient = new client_sqs_1.SQSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
const ecsClient = new client_ecs_1.ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_sqs_1.ReceiveMessageCommand({
            QueueUrl: process.env.QUEUE_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20,
        });
        while (true) {
            const { Messages } = yield sqsClient.send(command);
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
                    const event = JSON.parse(Body);
                    if ("Service" in event && "Event" in event) {
                        if (event.Event === "s3:TestEvent")
                            continue;
                    }
                    for (const record of event.Records) {
                        const { s3 } = record;
                        const { bucket, object: { key } } = s3;
                        // Spin up a Docker container
                        const command = new client_ecs_1.RunTaskCommand({
                            cluster: process.env.CLUSTER_NAME,
                            taskDefinition: process.env.TASK_DEFINITION,
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
                                                value: process.env.AWS_ACCESS_KEY_ID
                                            }, {
                                                name: "AWS_SECRET_ACCESS_KEY",
                                                value: process.env.AWS_SECRET_ACCESS_KEY
                                            }
                                        ]
                                    }]
                            }
                        });
                        yield ecsClient.send(command);
                        console.log("Bucket", bucket.name);
                        console.log("Object key", key);
                    }
                    // Delete the message from the queue
                    yield sqsClient.send(new client_sqs_1.DeleteMessageCommand({
                        QueueUrl: process.env.QUEUE_URL,
                        ReceiptHandle: message.ReceiptHandle
                    }));
                }
            }
            catch (error) {
                console.error("Error processing message", error);
            }
        }
    });
}
main();
