'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { articleApi, Article } from '@/shared/api/article';

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

    // Debounced search
    const handleSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await articleApi.getList({ page: 1, pageSize: 10, keyword: searchQuery });
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-card-bg rounded-2xl shadow-2xl overflow-hidden transition-colors">
                {/* Search Input */}
                <div className="flex items-center gap-4 p-4 border-b border-card-border">
                    <FaSearch className="text-text-muted" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="搜索文章标题或内容..."
                        className="flex-1 bg-transparent text-lg outline-none placeholder:text-text-subtle"
                    />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-card-border rounded-lg transition-colors"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
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
                                            {article.content.substring(0, 100)}...
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
