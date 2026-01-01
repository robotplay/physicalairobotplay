import DOMPurify from 'isomorphic-dompurify';

/**
 * HTML 콘텐츠를 sanitize하여 XSS 공격을 방지합니다.
 * @param html - sanitize할 HTML 문자열
 * @returns sanitize된 HTML 문자열
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';
    
    return DOMPurify.sanitize(html, {
        // 허용할 태그
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'code', 'pre', 'hr'
        ],
        // 허용할 속성
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'title', 'class', 'style',
            'width', 'height', 'target', 'rel'
        ],
        // data: URL 허용 (이미지 업로드용)
        ALLOW_DATA_ATTR: true,
        // 링크의 target="_blank"에 rel="noopener noreferrer" 자동 추가
        ADD_ATTR: ['target'],
        ADD_TAGS: [],
    });
}

/**
 * HTML 콘텐츠가 비어있는지 확인합니다 (태그 제거 후)
 * @param html - 확인할 HTML 문자열
 * @returns 비어있으면 true
 */
export function isHtmlEmpty(html: string): boolean {
    if (!html) return true;
    const textContent = html.replace(/<[^>]*>/g, '').trim();
    return textContent.length === 0;
}

