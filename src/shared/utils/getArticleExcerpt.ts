import { stripMarkdown } from './stripMarkdown';

const EMPTY_EXCERPT = '这篇文章还在整理中，欢迎稍后再来看看。';

export function getArticleExcerpt(content: string, length = 140): string {
    const plainText = stripMarkdown(content).replace(/\s+/g, ' ').trim();

    if (!plainText) {
        return EMPTY_EXCERPT;
    }

    if (plainText.length <= length) {
        return plainText;
    }

    return `${plainText.slice(0, length).trimEnd()}...`;
}
