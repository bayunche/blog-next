/**
 * Remove common Markdown / Obsidian syntax and keep readable plain text.
 */
export function stripMarkdown(text: string): string {
    const source = String(text || '');

    return source
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/~~~[\s\S]*?~~~/g, ' ')
        .replace(/!\[\[[^\]]+\]\]/g, ' ')
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/==([^=]+)==/g, '$1')
        .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^>\s?/gm, '')
        .replace(/^\|?(?:\s*:?-+:?\s*\|)+\s*$/gm, ' ')
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/^[-*_]{3,}\s*$/gm, ' ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')
        .replace(/(?<!_)_([^_]+)_(?!_)/g, '$1')
        .replace(/~~([^~]+)~~/g, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[|]/g, ' ')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}
