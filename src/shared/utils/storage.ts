/**
 * LocalStorage 工具函数
 * 提供类型安全的本地存储操作
 */

/**
 * 从 localStorage 读取数据
 * @param key 存储键
 * @returns 存储的值，如果不存在返回 null
 */
export const get = <T = any>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key)
    if (!value) return null

    // 尝试解析 JSON
    if (value.startsWith('{') || value.startsWith('[')) {
      return JSON.parse(value) as T
    }

    return value as T
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return null
  }
}

/**
 * 保存数据到 localStorage
 * @param key 存储键
 * @param value 要存储的值
 */
export const save = <T = any>(key: string, value: T): void => {
  try {
    const data = typeof value === 'object' ? JSON.stringify(value) : String(value)
    localStorage.setItem(key, data)
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

/**
 * 从 localStorage 删除数据
 * @param key 存储键
 */
export const remove = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error)
  }
}

/**
 * 清空所有 localStorage 数据
 */
export const clear = (): void => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * 检查 localStorage 中是否存在某个键
 * @param key 存储键
 * @returns 是否存在
 */
export const has = (key: string): boolean => {
  return localStorage.getItem(key) !== null
}

/**
 * 获取 localStorage 中所有的键
 * @returns 所有键的数组
 */
export const keys = (): string[] => {
  const allKeys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) allKeys.push(key)
  }
  return allKeys
}