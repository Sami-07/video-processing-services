# MyTube - A Scalable Video Transcoding Platform


## Demo Video
https://github.com/user-attachments/assets/683d3059-4e1d-46e9-9355-99db1c004206


## Multiple Video Upload
https://github.com/user-attachments/assets/84855fe9-9d38-40a0-ba1c-8a5fa5d22699

## AWS S3 Containing videos segments of different qualities and manifest files
https://github.com/user-attachments/assets/761b756b-94fa-47c8-a7db-a2c7d8aa68cc

## Overview

This project is a scalable video transcoding platform that allows users to upload, process, and share videos. It converts uploaded videos into HTTP Live Streaming (HLS) format for adaptive bitrate streaming, making them available for streaming on any device.

## Features

- **Video Upload**: Upload videos through a modern web interface
- **Automatic Transcoding**: Videos are automatically transcoded to multiple resolutions (360p, 480p, 720p)
- **Segmentation**: All the videos are segmented into chunks and made available for streaming
- **Adaptive Streaming**: HLS format allows for adaptive bitrate streaming based on viewer's connection
- **Real-time Status Updates**: Track the progress of video transcoding
- **Responsive Video Player**: Stream videos with adaptive quality on any device

## Architecture

![Architecture](https://yjl98ivw6f.ufs.sh/f/BPueypH3e51CPoQC1nYUEK9wn06vjOyG4ka7rVLMbs3Xo1ux)

The project consists of three main components:

### 1. Frontend (Next.js Application)
- Modern UI built with Next.js, React, and Tailwind CSS
- User authentication with Clerk
- Video upload functionality with AWS S3 integration
- HLS.js for video playback
- Real-time status updates using React Query

### 2. Video Consumer Service
- Node.js service that listens to S3 event notifications via SQS
- Triggers ECS tasks for video transcoding
- Manages the transcoding workflow

### 3. Transcoding Container
- Docker container with FFmpeg for video processing
- Transcodes videos to multiple resolutions
- Generates HLS playlists and segments
- Uploads transcoded content to S3
- Updates transcoding status in DynamoDB


## Workflow
- User uploads a video through the dashboard interface
- Raw video gets uploaded to the S3 raw videos bucket
- Upload event is sent to AWS SQS queue
- Node.js Video Consumer polls for video upload events
- When an event is found, a container is spun up to process the video
- The video is passed to the FFmpeg microservice
- FFmpeg transcodes the video into HLS format with multiple quality levels
- Transcoding status is written to DynamoDB
- Transcoded segments and manifest are stored in production S3 bucket
- Client receives index.m3u8 file when video is requested
- Video segments stream in real-time with adaptive bitrate


## Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **HLS.js**: JavaScript HLS client
- **Clerk**: Authentication provider
- **React Query**: Data fetching and state management
- **AWS SDK**: For S3 integration

### Backend
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **AWS SQS**: Message queue for event handling
- **AWS ECS**: Container orchestration
- **AWS S3**: Object storage for videos
- **AWS DynamoDB**: NoSQL database for status tracking

### Transcoding
- **Docker**: Containerization
- **FFmpeg**: Video processing library
- **Node.js**: JavaScript runtime
- **AWS SDK**: For S3 and DynamoDB integration

## Setup and Installation

### Prerequisites
- Node.js 18 or higher
- Docker
- AWS Account with configured credentials
- PostgreSQL database

### Environment Variables

#### Frontend (.env)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DATABASE_URL=your_postgres_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your_upload_bucket_name
```

#### Video Consumer (.env)
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
QUEUE_URL=your_sqs_queue_url
CLUSTER_NAME=your_ecs_cluster_name
TASK_DEFINITION=your_ecs_task_definition
```

#### Transcoding Container (.env)
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
BUCKET_NAME=your_source_bucket_name
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sami-07/video-processing-services.git
   cd mytube
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Video Consumer**
   ```bash
   cd video-consumer
   npm install
   npm run dev
   ```

4. **Build and Run Docker Container**
   ```bash
   cd container
   docker build -t video-transcoder .
   docker run -d --env-file .env video-transcoder
   ```

## AWS Infrastructure Setup

1. Create S3 buckets for video upload and transcoded content
2. Set up SQS queue for S3 event notifications
3. Configure ECS cluster and task definition
4. Set up DynamoDB table for transcoding status
5. Configure IAM roles and permissions

## Usage

1. Sign up or sign in to the platform
2. Upload a video through the web interface
3. The video will be automatically sent for transcoding
4. Track the transcoding progress in real-time
5. Once complete, the video will be available for streaming
6. Play the video with adaptive quality based on your connection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
