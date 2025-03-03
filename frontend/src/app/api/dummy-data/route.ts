import { db } from "@/drizzle/db";
import { Video } from "@/drizzle/schema";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
    const dummyVideoData: any[] = []

Array.from({ length: 100 }).forEach((_, index) => {
    dummyVideoData.push({
        id: randomUUID(),
        title: `Video-title-${index}`,
        description: `  <p>In this video, we dive into actionable strategies and techniques to help you achieve peak productivity. Whether you're struggling to manage your time or looking to optimize your daily routine, this video has something for everyone.</p>

    <h3>What You'll Learn</h3>
    <ul>
        <li>How to prioritize tasks effectively</li>
        <li>Tips for avoiding procrastination</li>
        <li>Simple methods to enhance focus</li>
        <li>The importance of breaks and work-life balance</li>
    </ul>

    <h3>Who Is This Video For?</h3>
    <p>This video is perfect for:</p>
    <ul>
        <li>Students looking to improve their study habits</li>
        <li>Professionals managing a busy schedule</li>
        <li>Entrepreneurs striving to maximize output</li>
        <li>Anyone aiming to make the most of their day</li>
    </ul>

    <h3>Key Topics Covered</h3>
    <ol>
        <li><strong>Time Management Techniques</strong>
            <p>Learn the Pomodoro Technique, time-blocking, and other methods to structure your day for maximum efficiency.</p>
        </li>
        <li><strong>Focus and Concentration</strong>
            <p>Discover how to eliminate distractions and enter a state of deep work.</p>
        </li>
        <li><strong>Overcoming Procrastination</strong>
            <p>Understand the psychology behind procrastination and how to combat it effectively.</p>
        </li>
        <li><strong>Building Productive Habits</strong>
            <p>Explore how small, consistent changes can lead to significant improvements over time.</p>
        </li>
    </ol>

    <h3>Don't Forget to Subscribe!</h3>
    <p>If you find this video helpful, please give it a thumbs up and subscribe to our channel for more tips on productivity and personal growth.</p>

    <h3>Resources Mentioned</h3>
    <ul>
        <li><a href="https://example.com/productivity-app">Top Productivity Apps</a></li>
        <li><a href="https://example.com/book-recommendations">Book Recommendations for Productivity</a></li>
    </ul>

    <p>Start transforming your life today—watch the video and take the first step toward a more productive you!</p>`,
        thumbnailKey: `c2999a57-4038-4d8c-b37c-21399b871456.jpg`,
        videoKey: `df314e3e-bd2b-4b68-b583-b7e8cd57b36e.mp4`,
        userId: "user_2pN79lxC8u497MhoqUtG9GzIPGE",
    })
})



async function insertDummyVideos() {
    const videoRecords = dummyVideoData.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        createdAt: new Date(),
        userId: video.userId,
        videoKey: video.videoKey,
        thumbnailKey: video.thumbnailKey,

    }));

    await db.insert(Video).values(videoRecords);
}

insertDummyVideos();

    return NextResponse.json({ message: 'Hello, world!' });
}