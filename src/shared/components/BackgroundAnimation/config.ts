/**
 * 背景动画配置文件
 * 适配 diygod.cc 风格
 */

export const backgroundConfig = {
  // 背景图片列表 - 可以添加自定义背景图
  images: [],

  // 切换间隔时间（毫秒）
  switchInterval: 8000,

  // 粒子配置（暖橙色系）
  particles: {
    count: 30, // 粒子数量
    speed: 1, // 粒子速度
    opacity: 0.8, // 最大透明度
    size: 2, // 粒子大小
    colors: ['#d67f47', '#e8a378', '#f9ba81', '#fde8d5', '#87ceeb'], // 暖橙色系粒子
    shadowBlur: 20, // 阴影模糊度
    shapes: ['circle', 'heart', 'star'], // 粒子形状
  },

  // 背景图片效果
  imageEffects: {
    brightness: 0.7, // 亮度
    contrast: 1.1, // 对比度
    blur: 0, // 模糊度（像素）
  },

  // 遮罩层配置
  overlay: {
    gradient:
      'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%)',
    opacity: 1,
  },

  // 过渡效果
  transition: {
    duration: 2, // 秒
    easing: 'ease-in-out',
  },

  // 性能优化
  performance: {
    pauseWhenHidden: true, // 页面隐藏时暂停动画
    reduceOnMobile: true, // 移动端减少粒子数量
    maxFPS: 60, // 最大帧率
  },
} as const

// 预设主题
export const themes = {
  nature: {
    name: '自然风光',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    ],
    particles: { color: '#90EE90', count: 40 },
  },

  city: {
    name: '城市夜景',
    images: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2088&q=80',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&auto=format&fit=crop&w=2056&q=80',
    ],
    particles: { color: '#87CEEB', count: 60 },
  },

  space: {
    name: '星空宇宙',
    images: [
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ],
    particles: { color: '#DDA0DD', count: 80 },
  },
} as const

export type ThemeName = keyof typeof themes
