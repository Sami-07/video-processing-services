"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SparklesCore } from "@/components/ui/sparkles";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TracingBeam } from "@/components/ui/tracing-beam";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        <div className="z-10 text-center px-6 md:px-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              MyTube - A scalable cloud solution for video transcoding.
            </h1>
          </motion.div>
          
          <TextGenerateEffect
            words="A scalable cloud solution for video streaming and content sharing."
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          />
          
          {/* Complete workflow demo video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-4xl mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20"
          >
            <video 
              controls 
              className="w-full h-auto rounded-xl border border-gray-700"
        
            >
              <source src="/demos/new hls demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center my-0"
          >
            <button onClick={() => router.push("/dashboard/all-videos")} className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-lg hover:shadow-lg hover:scale-105 transition duration-200">
              Get Started
            </button>
          
          </motion.div>
        </div>
        
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={70}
            className="w-full h-full"
            particleColor="#4FFFFF"
          />
        </div>
        <BackgroundBeams className="opacity-20" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            Powerful Features
          </h2>
          
          {/* Scalability demo video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full max-w-4xl mx-auto mb-16 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white p-4 bg-gray-800/50 backdrop-blur-sm">Scalability Demonstration</h3>
            <video 
              controls 
              className="w-full h-auto rounded-xl border border-gray-700"
             
            >
              <source src="/demos/2 videos upload demo hls.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm">
              <p className="text-gray-300">This demo shows how our system scales by processing multiple videos simultaneously, with each video getting its own dedicated container.</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Easy Video Upload",
                description: "Upload videos through a modern web interface with drag and drop support",
                icon: "📤"
              },
              {
                title: "Automatic Transcoding",
                description: "Videos are automatically transcoded to multiple resolutions (360p, 480p, 720p)",
                icon: "🔄"
              },
              {
                title: "Adaptive Streaming",
                description: "HLS format allows for adaptive bitrate streaming based on viewer's connection",
                icon: "📱"
              },
              {
                title: "Video Segmentation",
                description: "All videos are segmented into chunks for efficient streaming",
                icon: "🧩"
              },
              {
                title: "Real-time Status Updates",
                description: "Track the progress of video transcoding in real-time",
                icon: "📊"
              },
              {
                title: "Responsive Video Player",
                description: "Stream videos with adaptive quality on any device",
                icon: "▶️"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section with Tracing Beam */}
      <section id="architecture" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            Cloud Architecture
          </h2>
          
          <TracingBeam className="px-2">
            <div className="max-w-5xl mx-auto space-y-14">
              <div>
                <h3 className="text-2xl font-bold text-white mb-5">How It Works</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our platform implements a sophisticated cloud-based architecture for efficient video processing and delivery.
                  The system handles everything from upload to adaptive streaming automatically.
                </p>
                <div className="rounded-lg overflow-hidden border border-gray-800 mb-10 shadow-2xl">
                  <Image 
                    src="https://yjl98ivw6f.ufs.sh/f/BPueypH3e51CPoQC1nYUEK9wn06vjOyG4ka7rVLMbs3Xo1ux" 
                    alt="Architecture Diagram" 
                    width={1200} 
                    height={1200} 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-5">The Workflow</h3>
                <ol className="space-y-6">
                  {[
                    "User uploads a video through the dashboard interface",
                    "Raw video gets uploaded to the S3 raw videos bucket",
                    "Upload event is sent to AWS SQS queue",
                    "Node.js Video Consumer polls for video upload events",
                    "When an event is found, a container is spun up to process the video",
                    "The video is passed to the FFmpeg microservice",
                    "FFmpeg transcodes the video into HLS format with multiple quality levels",
                    "Transcoding status is written to DynamoDB",
                    "Transcoded segments and manifest are stored in production S3 bucket",
                    "Client receives index.m3u8 file when video is requested",
                    "Video segments stream in real-time with adaptive bitrate"
                  ].map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                        {index + 1}
                      </div>
                      <div className="text-gray-300 pt-1">{step}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            Powered By Modern Tech
          </h2>
          
          <StickyScroll
            content={[
              {
                title: "Frontend",
                description: "Built with Next.js, React, TypeScript, and Tailwind CSS. Features HLS.js for video playback, Clerk for authentication, and React Query for state management.",
                content: (
                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    {["Next.js", "React", "TypeScript", "Tailwind CSS", "HLS.js", "Clerk", "React Query"].map((tech) => (
                      <span key={tech} className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm ">
                        {tech}
                      </span>
                    ))}
                  </div>
                )
              },
              {
                title: "Backend",
                description: "Leverages Node.js with TypeScript, AWS SQS for messaging, ECS for containerization, S3 for storage, and DynamoDB for data persistence.",
                content: (
                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    {["Node.js", "TypeScript", "AWS SQS", "AWS ECS", "AWS S3", "AWS DynamoDB"].map((tech) => (
                      <span key={tech} className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )
              },
              {
                title: "Transcoding",
                description: "Utilizes Docker containers running FFmpeg for efficient video processing, with Node.js for orchestration and AWS SDK for cloud integration.",
                content: (
                  <div className="flex flex-wrap gap-4 justify-center items-center">
                    {["Docker", "FFmpeg", "Node.js", "AWS SDK"].map((tech) => (
                      <span key={tech} className="px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your video experience?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              Start using MyTube today and provide your users with
              a seamless streaming experience on any device.
            </p>
            <button className="px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium text-lg hover:shadow-lg hover:scale-105 transition duration-200">
              Get Started Now
            </button>
          </motion.div>
        </div>
        <BackgroundBeams className="opacity-30" />
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                MyTube
              </h3>
            </div>
            <div className="flex gap-8">
              <a href="http://x.com/sami73010" className="text-gray-400 hover:text-white transition">X</a>
              <a href="https://github.com/Sami-07/video-processing-services" className="text-gray-400 hover:text-white transition">GitHub</a>
              <a href="https://www.linkedin.com/in/shaikh-abdul-sami-879287211/" className="text-gray-400 hover:text-white transition">LinkedIn</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
            © {new Date().getFullYear()} MyTube. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
