import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from '@/lib/icons'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import uploadToS3 from '@/utils/upload-to-aws'
import { z } from 'zod'
import Tiptap from '../globals/tiptap/tiptap'
import { useToast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import '@/styles/tiptap.css'
type FileWithPreview = File & {
    preview?: string;
}

interface VideoFormData {
    title: string;
    description: string;
    videoFile: File | null;
    thumbnail: FileWithPreview | null;
}

const uploadVideoSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    videoFile: z.instanceof(File),
    thumbnail: z.instanceof(File),
})

export default function UploadVideo() {
    const { toast } = useToast()
    const { user, isLoaded } = useUser()
    const router = useRouter()
    if (!isLoaded) return null
    const [formData, setFormData] = useState<VideoFormData>({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null,
    })

    // Video dropzone
    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
        onDrop: useCallback((acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            setFormData(prev => ({ ...prev, videoFile: file }))
        }, []),
        accept: {
            'video/*': ['.mp4', '.mov', '.avi', '.mkv']
        },
        maxFiles: 1,
        maxSize: 100 * 1024 * 1024, // 100MB
    })

    // Thumbnail dropzone
    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
        onDrop: useCallback((acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            Object.assign(file, { preview: URL.createObjectURL(file) })
            setFormData(prev => ({ ...prev, thumbnail: file as FileWithPreview }))
        }, []),
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
    })

    const handleUpload = async () => {
        // Handle upload here
        const validatedData = uploadVideoSchema.safeParse(formData)
        if (!validatedData.success) {
            toast({
                title: 'Please fill in all the fields',
                description: validatedData.error.errors[0].message,
            })
            return
        }

        console.log('Uploading data:', formData)
       try {
         const videoBuffer = await formData.videoFile?.arrayBuffer()
         const thumbnailBuffer = await formData.thumbnail?.arrayBuffer()
        console.log("videoType", formData.videoFile?.type)
         const videoResponse = await fetch('/api/aws/get-url-promise', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 fileType: formData.videoFile?.type,
                 type: "VIDEO"
             }),
         });
         const videoData = await videoResponse.json()
         const videoUrl = videoData.url
         const videoKey = videoData.key
         const s3Response = await fetch(videoUrl, {
             method: 'PUT',
             body: videoBuffer,
             headers: {
                 'Content-Type': formData.videoFile?.type || 'application/octet-stream',
             },
         });
         console.log('Video key:', videoKey)
 
         const thumbnailResponse = await fetch('/api/aws/get-url-promise', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 fileType: formData.thumbnail?.type,
                 type: "THUMBNAIL"
             }),
         });
         const thumbnailData = await thumbnailResponse.json()
         const thumbnailUrl = thumbnailData.url
         const thumbnailKey = thumbnailData.key
         const s3ThumbnailResponse = await fetch(thumbnailUrl, {
             method: 'PUT',
             body: thumbnailBuffer,
             headers: {
                 'Content-Type': formData.thumbnail?.type || 'application/octet-stream',
             },
         });
         console.log('Thumbnail key:', thumbnailKey)
         const uploadVideoResponse = await fetch('/api/videos', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 title: formData.title,
                 description: formData.description,
                 videoKey,
                 thumbnailKey,
                 userId: user?.id,
             }),
         });
 
         return videoKey
 
       } catch (error: any) {
        console.error("error uploading video", error)
       
       }
    }
    const { mutate: uploadVideo, isPending } = useMutation({
        mutationFn: handleUpload,
        onSuccess: (videoKey) => {
            toast({
                title: 'Video uploaded successfully',
                description: "Your video has been uploaded successfully. The video transcoding has started. You can view it after it's done.",
            })
            setTimeout(() => {
                router.push(`/transcoding-status/${videoKey}`)
            }, 2000)
        }
    })
    return (
        <div>
            <Dialog>
                <DialogTrigger className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md'>
                    Upload Video <Icons.Upload />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] overflow-y-auto max-h-full">
                    <DialogHeader>
                        <DialogTitle >Upload Video</DialogTitle>
                        <DialogDescription>
                            Upload a video to your account. Maximum file size: 100MB
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter video title"
                                />
                            </div>
                            <div className='description-content w-full '>
                                <Label htmlFor="description">Description</Label>
                                <Tiptap
                                    description={formData.description}
                                    setDescription={(e) => setFormData(prev => ({ ...prev, description: e }))}
                                />
                            </div>
                        </div>
                        {/* Video Upload */}
                        <div>
                            <Label>Video File</Label>
                            <div
                                {...getVideoRootProps()}
                                className={cn(
                                    'border-2 border-dashed rounded-lg p-6 cursor-pointer text-center',
                                    'hover:border-primary/50 transition-colors',
                                    isVideoDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                                )}
                            >
                                <input {...getVideoInputProps()} />
                                {formData.videoFile ? (
                                    <div className="space-y-2">
                                        <Icons.FileVideo className="w-10 h-10 mx-auto text-primary" />
                                        <p className="text-sm">{formData.videoFile.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Icons.Upload className="w-10 h-10 mx-auto text-gray-400" />
                                        <p>Drag & drop a video here, or click to select</p>
                                        <p className="text-sm text-gray-500">
                                            Supported formats: MP4, MOV, AVI, MKV
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <Label>Thumbnail</Label>
                            <div
                                {...getThumbnailRootProps()}
                                className={cn(
                                    'border-2 border-dashed rounded-lg p-6 cursor-pointer text-center',
                                    'hover:border-primary/50 transition-colors',
                                    isThumbnailDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
                                )}
                            >
                                <input {...getThumbnailInputProps()} />
                                {formData.thumbnail ? (
                                    <div className="space-y-2">
                                       {formData.thumbnail.preview ? <Image
                                            src={formData.thumbnail.preview}
                                            alt="Thumbnail preview"
                                            width={200}
                                            height={112}
                                            className="mx-auto rounded-lg"
                                            objectFit="cover"
                                        /> : <Icons.Image className="w-10 h-10 mx-auto text-gray-400" />    }
                                        <p className="text-sm">{formData.thumbnail.name}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Icons.Image className="w-10 h-10 mx-auto text-gray-400" />
                                        <p>Upload a thumbnail image</p>
                                        <p className="text-sm text-gray-500">
                                            Supported formats: JPEG, PNG, WebP
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>



                        {/* Upload Button */}
                        {formData.videoFile && formData.thumbnail ? (
                            <button
                                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                onClick={() => uploadVideo()}
                                disabled={isPending}
                            >
                                {isPending ? 'Uploading...' : 'Upload'}
                            </button>
                        ) : (
                            <button
                                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"

                                onClick={() => {
                                    toast({
                                        title: 'Please upload a video and thumbnail',
                                        description: 'Both the video and thumbnail are required to upload a video',
                                    })
                                }}
                            >
                                {isPending ? 'Uploading...' : 'Upload'}
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}