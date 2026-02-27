'use client';

import { use } from 'react';
import ArticleEditor from '../../../components/ArticleEditor';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ArticleEditor articleId={parseInt(id)} />;
}
