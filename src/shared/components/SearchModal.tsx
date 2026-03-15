'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { articleApi, Article } from '@/shared/api/article';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard shortcut: Cmd/Ctrl + K to open, Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Debounced search
    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await articleApi.getList({ page: 1, pageSize: 10, keyword: searchQuery, type: true });
            setResults(res.rows);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle input change with debounce
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            handleSearch(value);
        }, 300);
    };

    // Handle result click
    const handleResultClick = () => {
        setQuery('');
        setResults([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-20 sm:pt-24">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card-bg shadow-2xl transition-colors">
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-card-border px-4 py-4 sm:gap-4">
                    <FaSearch className="shrink-0 text-text-muted" size={18} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="搜索文章标题或内容..."
                        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-text-subtle sm:text-lg"
                    />
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors hover:bg-card-border"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[min(70vh,calc(100dvh-8rem))] overflow-y-auto sm:max-h-[60vh]">
                    {loading && (
                        <div className="p-8 text-center text-text-muted">
                            搜索中...
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="p-8 text-center text-text-muted">
                            没有找到匹配的文章
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <ul className="divide-y divide-card-border">
                            {results.map((article) => (
                                <li key={article.id}>
                                    <Link
                                        href={`/posts/${article.id}`}
                                        onClick={handleResultClick}
                                        className="block p-4 hover:bg-card-border/50 transition-colors"
                                    >
                                        <h4 className="font-medium mb-1 line-clamp-1">
                                            {article.title}
                                        </h4>
                                        <p className="text-sm text-text-muted line-clamp-2">
                                            {getArticleExcerpt(article.content, 100)}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!query && (
                        <div className="p-8 text-center text-text-subtle">
                            <p className="text-sm">按 <kbd className="px-2 py-1 bg-card-border rounded text-xs">ESC</kbd> 关闭</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
