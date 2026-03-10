/**
 * Strip common Markdown syntax from a string, leaving plain text.
 */
export function stripMarkdown(text: string): string {
    return text
        // Remove images: ![alt](url)
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        // Remove links: [text](url)
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        // Remove headings: # ## ### etc.
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bold/italic: **text**, *text*, __text__, _text_
        .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
        .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
        // Remove inline code: `code`
        .replace(/`([^`]+)`/g, '$1')
        // Remove blockquotes: > text
        .replace(/^>\s+/gm, '')
        // Remove horizontal rules: --- or *** or ___
        .replace(/^[-*_]{3,}\s*$/gm, '')
        // Remove list markers: - item, * item, 1. item
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        // Collapse multiple blank lines
        .replace(/\n{2,}/g, ' ')
        .replace(/\n/g, ' ')
        .trim();
}
