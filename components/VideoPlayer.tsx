'use client';

import { useState } from 'react';

interface CourseLesson {
    lessonId: string;
    title: string;
    description?: string;
    videoType: 'youtube' | 'vimeo' | 'url';
    videoUrl: string;
    duration: number;
}

interface VideoPlayerProps {
    lesson: CourseLesson;
    onComplete?: () => void;
    onProgress?: (progress: number) => void;
}

export default function VideoPlayer({ lesson, onComplete, onProgress }: VideoPlayerProps) {
    const [progress, setProgress] = useState(0);

    // YouTube 플레이어
    const renderYouTubePlayer = () => {
        const videoId = lesson.videoUrl;
        
        return (
            <div className="relative w-full aspect-video bg-black">
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    };

    // Vimeo 플레이어
    const renderVimeoPlayer = () => {
        const videoId = lesson.videoUrl;
        
        return (
            <div className="relative w-full aspect-video bg-black">
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
                    title={lesson.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    };

    // 직접 URL 플레이어 (HTML5 video)
    const renderDirectPlayer = () => {
        return (
            <div className="relative w-full aspect-video bg-black group">
                <video
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    onTimeUpdate={(e) => {
                        const video = e.target as HTMLVideoElement;
                        const currentProgress = (video.currentTime / video.duration) * 100;
                        setProgress(currentProgress);
                        onProgress?.(currentProgress);

                        // 90% 시청 시 완료 처리
                        if (currentProgress >= 90 && onComplete) {
                            onComplete();
                        }
                    }}
                    onEnded={() => {
                        onComplete?.();
                    }}
                    controls
                />
            </div>
        );
    };

    // 플레이어 렌더링
    const renderPlayer = () => {
        switch (lesson.videoType) {
            case 'youtube':
                return renderYouTubePlayer();
            case 'vimeo':
                return renderVimeoPlayer();
            case 'url':
                return renderDirectPlayer();
            default:
                return (
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        <p className="text-white">지원하지 않는 비디오 형식입니다</p>
                    </div>
                );
        }
    };

    return (
        <div className="relative bg-black">
            {renderPlayer()}
            
            {/* Progress Bar (외부용 - YouTube/Vimeo는 자체 컨트롤 사용) */}
            {lesson.videoType === 'url' && progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Lesson Title Overlay */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{lesson.title}</h3>
                {lesson.description && (
                    <p className="text-gray-300 text-sm mt-1">{lesson.description}</p>
                )}
            </div>
        </div>
    );
}
