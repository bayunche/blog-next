'use client';

import { useAuthStore } from '@/shared/store/authStore';

export default function AdminDashboard() {
    const user = useAuthStore(state => state.user);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold">Welcome, {user?.username}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm">Total Posts</h3>
                    <p className="text-3xl font-bold mt-2">102</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm">Total Comments</h3>
                    <p className="text-3xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm">Total Views</h3>
                    <p className="text-3xl font-bold mt-2">45.2k</p>
                </div>
            </div>
        </div>
    );
}
