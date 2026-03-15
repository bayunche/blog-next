'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/shared/components/Navbar';
import { Background } from '@/shared/components/Background';
import { Footer } from '@/shared/components/Footer';
import { SakuraParticles } from '@/components/SakuraParticles';
import { FloatingToolbar } from '@/components/FloatingToolbar';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Live2DWidget } from '@/components/Live2DWidget';
import { MusicPlayer } from '@/components/MusicPlayer';
import { RuntimeErrorGuard } from '@/components/RuntimeErrorGuard';

interface AppChromeProps {
    children: React.ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
    const pathname = usePathname() || '';
    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <>
            {isAdminRoute ? (
                <div className="min-h-screen">
                    <RuntimeErrorGuard />
                    {children}
                </div>
            ) : (
                <>
                    <RuntimeErrorGuard />
                    <LoadingScreen />
                    <Background />
                    <SakuraParticles count={25} />

                    <Navbar />
                    <main className="min-h-screen pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-0">
                        {children}
                    </main>
                    <Footer />

                    <FloatingToolbar />
                    <Live2DWidget />
                </>
            )}
            {/* MusicPlayer 始终在固定位置，避免路由切换时卸载重挂导致播放中断 */}
            <MusicPlayer />
        </>
    );
}
