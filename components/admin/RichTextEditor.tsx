'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { 
    Bold, 
    Italic, 
    Underline, 
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Image as ImageIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Loader2,
    Code2,
    Eye
} from 'lucide-react';
import { useState, useRef } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ 
    content, 
    onChange, 
    placeholder = '내용을 입력하세요...',
    onImageUpload 
}: RichTextEditorProps) {
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(content);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-deep-electric-blue hover:underline',
                },
            }),
            Youtube.configure({
                controls: true,
                nocookie: false,
                width: 640,
                height: 360,
                HTMLAttributes: {
                    class: 'youtube-video',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-900 dark:prose-p:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-deep-electric-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:my-4 prose-img:mx-auto prose-img:max-w-full prose-ul:text-gray-900 dark:prose-ul:text-white prose-ol:text-gray-900 dark:prose-ol:text-white prose-li:text-gray-900 dark:prose-li:text-white prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:border-gray-400 dark:prose-blockquote:border-gray-500 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-4 [&_iframe]:max-w-full',
            },
        },
    });

    const handleImageUpload = async (file: File) => {
        if (!editor || !onImageUpload) return;

        setIsUploadingImage(true);
        try {
            // 이미지 압축 (3MB 이상인 경우)
            let fileToUpload = file;
            if (file.size > 3 * 1024 * 1024) {
                fileToUpload = await compressImage(file);
            }

            // 이미지 업로드
            const imageUrl = await onImageUpload(fileToUpload);
            
            // 에디터에 이미지 삽입
            editor.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error: any) {
            console.error('이미지 업로드 오류:', error);
            alert(`이미지 업로드에 실패했습니다: ${error.message}`);
        } finally {
            setIsUploadingImage(false);
        }
    };

    // 이미지 압축 함수
    const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.85): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = width * ratio;
                        height = height * ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context를 가져올 수 없습니다.'));
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('이미지 압축에 실패했습니다.'));
                                return;
                            }
                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        quality
                    );
                };
                img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
            reader.readAsDataURL(file);
        });
    };

    if (!editor) {
        return (
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4 min-h-[300px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
            {/* 툴바 */}
            <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-700">
                {/* 텍스트 스타일 */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="굵게 (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="기울임 (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="취소선"
                >
                    <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* 제목 */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="제목 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="제목 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="제목 3"
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* 리스트 */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="글머리 기호"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="번호 매기기"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="인용구"
                >
                    <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* 정렬 */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="왼쪽 정렬"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="가운데 정렬"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="오른쪽 정렬"
                >
                    <AlignRight className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* 이미지 업로드 */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleImageUpload(file);
                        }
                        if (e.target) {
                            e.target.value = '';
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage || !onImageUpload}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
                    title="이미지 삽입"
                >
                    {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <ImageIcon className="w-4 h-4" />
                    )}
                </button>

                {/* 링크 */}
                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt('링크 URL을 입력하세요 (유튜브 URL은 자동으로 동영상으로 변환됩니다):');
                        if (url) {
                            // 유튜브 URL 감지 및 변환
                            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                            const match = url.match(youtubeRegex);
                            
                            if (match && match[1]) {
                                // 유튜브 동영상 ID 추출하여 임베드
                                const videoId = match[1];
                                editor.chain().focus().setYoutubeVideo({
                                    src: `https://www.youtube.com/embed/${videoId}`,
                                }).run();
                            } else {
                                // 일반 링크로 삽입
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }
                    }}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
                    }`}
                    title="링크 삽입 (유튜브 URL은 자동으로 동영상으로 변환)"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* 실행 취소/다시 실행 */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-200"
                    title="실행 취소 (Ctrl+Z)"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-200"
                    title="다시 실행 (Ctrl+Y)"
                >
                    <Redo className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1" />

                {/* HTML 모드 토글 */}
                <button
                    type="button"
                    onClick={() => {
                        if (isHtmlMode) {
                            // HTML → Visual 모드
                            editor?.commands.setContent(htmlContent);
                            setIsHtmlMode(false);
                        } else {
                            // Visual → HTML 모드
                            const currentHtml = editor?.getHTML() || '';
                            setHtmlContent(currentHtml);
                            setIsHtmlMode(true);
                        }
                    }}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 ${
                        isHtmlMode ? 'bg-deep-electric-blue text-white hover:bg-blue-700' : ''
                    }`}
                    title={isHtmlMode ? 'Visual 모드로 전환' : 'HTML 소스 편집'}
                >
                    {isHtmlMode ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </button>
            </div>

            {/* 에디터 영역 */}
            {isHtmlMode ? (
                <div className="min-h-[300px] max-h-[600px] overflow-y-auto p-4">
                    <textarea
                        value={htmlContent}
                        onChange={(e) => {
                            setHtmlContent(e.target.value);
                            onChange(e.target.value);
                        }}
                        className="w-full min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none outline-none resize-none"
                        placeholder="HTML 코드를 직접 입력하세요..."
                        spellCheck={false}
                    />
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
                        💡 HTML 소스를 직접 편집할 수 있습니다. Visual 모드로 전환하면 미리보기가 가능합니다.
                    </div>
                </div>
            ) : (
                <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
                    <EditorContent editor={editor} />
                </div>
            )}
        </div>
    );
}






