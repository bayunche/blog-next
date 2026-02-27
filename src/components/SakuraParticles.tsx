'use client';

import { useEffect, useRef } from 'react';

interface Sakura {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
}

interface SakuraParticlesProps {
    // 樱花数量
    count?: number;
    // 启用/禁用
    enabled?: boolean;
}

export const SakuraParticles = ({ count = 30, enabled = true }: SakuraParticlesProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sakurasRef = useRef<Sakura[]>([]);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        if (!enabled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 设置 canvas 尺寸
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 初始化樱花
        const initSakuras = () => {
            sakurasRef.current = [];
            for (let i = 0; i < count; i++) {
                sakurasRef.current.push(createSakura(canvas.width, canvas.height, true));
            }
        };

        // 创建单个樱花
        const createSakura = (width: number, height: number, randomY: boolean = false): Sakura => {
            return {
                x: Math.random() * width,
                y: randomY ? Math.random() * height : -20,
                size: Math.random() * 12 + 8,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1.5 + 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.5 + 0.5,
            };
        };

        // 绘制樱花花瓣
        const drawSakura = (sakura: Sakura) => {
            ctx.save();
            ctx.translate(sakura.x, sakura.y);
            ctx.rotate(sakura.rotation);
            ctx.globalAlpha = sakura.opacity;

            // 樱花花瓣形状
            const petalSize = sakura.size;
            ctx.beginPath();

            // 绘制5片花瓣
            for (let i = 0; i < 5; i++) {
                const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                const x = Math.cos(angle) * petalSize * 0.5;
                const y = Math.sin(angle) * petalSize * 0.5;

                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(
                    x + Math.cos(angle + 0.5) * petalSize * 0.3,
                    y + Math.sin(angle + 0.5) * petalSize * 0.3,
                    x,
                    y
                );
                ctx.quadraticCurveTo(
                    x + Math.cos(angle - 0.5) * petalSize * 0.3,
                    y + Math.sin(angle - 0.5) * petalSize * 0.3,
                    0,
                    0
                );
            }

            // 渐变填充
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.3, 'rgba(255, 192, 203, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 182, 193, 0.6)');

            ctx.fillStyle = gradient;
            ctx.fill();

            // 中心点
            ctx.beginPath();
            ctx.arc(0, 0, petalSize * 0.15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.fill();

            ctx.restore();
        };

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sakurasRef.current.forEach((sakura, index) => {
                // 更新位置
                sakura.x += sakura.speedX + Math.sin(sakura.y * 0.01) * 0.5;
                sakura.y += sakura.speedY;
                sakura.rotation += sakura.rotationSpeed;

                // 边界检测
                if (sakura.y > canvas.height + 20) {
                    sakurasRef.current[index] = createSakura(canvas.width, canvas.height);
                }
                if (sakura.x < -20) {
                    sakura.x = canvas.width + 20;
                }
                if (sakura.x > canvas.width + 20) {
                    sakura.x = -20;
                }

                drawSakura(sakura);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        initSakuras();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, [count, enabled]);

    if (!enabled) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{ mixBlendMode: 'normal' }}
        />
    );
};
