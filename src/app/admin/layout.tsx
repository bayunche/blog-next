'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const isAdmin = useAuthStore(state => state.isAdmin());
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return null; // Or loading spinner
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-white shadow-md z-10">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <a href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Dashboard</a>
                    <a href="/admin/articles" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Articles</a>
                    <a href="/admin/categories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Categories</a>
                    <a href="/admin/tags" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Tags</a>
                    <a href="/admin/comments" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">Comments</a>
                    <a href="/" className="block px-4 py-2 text-primary hover:bg-gray-100 rounded mt-8">Back to Site</a>
                </nav>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
