/**
 * 加密工具函数
 * 使用 AES 加密算法进行密码加密
 */

import CryptoJS from 'crypto-js'

// 从环境变量获取加密密钥和向量
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || '1234567890000000' // 16位
const ENCRYPTION_IV = import.meta.env.VITE_ENCRYPTION_IV || '1234567890000000' // 16位

const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY)
const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV)

/**
 * AES 加密
 * @param word 要加密的内容（字符串或对象）
 * @returns 加密后的字符串
 */
export const encrypt = (word: string | object): string => {
  let encrypted = ''

  if (typeof word === 'string') {
    const srcs = CryptoJS.enc.Utf8.parse(word)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
  } else if (typeof word === 'object') {
    // 对象格式的转成 JSON 字符串
    const data = JSON.stringify(word)
    const srcs = CryptoJS.enc.Utf8.parse(data)
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
  }

  return encrypted.ciphertext.toString()
}

/**
 * AES 解密
 * @param word 要解密的密文
 * @returns 解密后的字符串
 */
export const decrypt = (word: string): string => {
  try {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypted = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8)
    return decryptedStr
  } catch (error) {
    console.error('Decryption error:', error)
    return ''
  }
}

/**
 * 加密密码（用于登录/注册等场景）
 * @param password 原始密码
 * @returns 加密后的密码
 */
export const encryptPassword = (password: string): string => {
  return encrypt(password)
}

/**
 * 生成随机密码
 * @param length 密码长度，默认 12 位
 * @returns 随机密码
 */
export const generateRandomPassword = (length = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

/**
 * 验证密码强度
 * @param password 待验证的密码
 * @returns 验证结果
 */
export interface PasswordValidation {
  isValid: boolean
  message: string
  score: number
}

export const validatePassword = (password: string): PasswordValidation => {
  const result: PasswordValidation = {
    isValid: false,
    message: '',
    score: 0,
  }

  if (!password) {
    result.message = '密码不能为空'
    return result
  }

  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  // 计算密码强度分数
  let score = 0
  if (password.length >= minLength) score += 20
  if (password.length >= 12) score += 10
  if (hasUpperCase) score += 20
  if (hasLowerCase) score += 20
  if (hasNumbers) score += 20
  if (hasSpecialChar) score += 20

  result.score = score

  // 基本验证
  if (password.length < minLength) {
    result.message = `密码长度至少需要${minLength}位`
    return result
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    result.message = '密码必须包含大写字母、小写字母和数字'
    return result
  }

  // 检查常见弱密码
  const commonPasswords = [
    '12345678',
    '123456789',
    'password',
    'qwerty123',
    'abc123456',
    '11111111',
    '00000000',
  ]

  if (commonPasswords.includes(password.toLowerCase())) {
    result.message = '不能使用常见的弱密码'
    return result
  }

  // 检查重复字符
  const repeatedChar = /(.)\1{2,}/.test(password)
  if (repeatedChar) {
    result.message = '密码不能包含连续重复的字符'
    return result
  }

  result.isValid = true

  if (score >= 80) {
    result.message = '密码强度：强'
  } else if (score >= 60) {
    result.message = '密码强度：中等'
  } else {
    result.message = '密码强度：弱，建议添加特殊字符'
  }

  return result
}

/**
 * 获取密码强度等级
 * @param password 密码
 * @returns 强度等级：weak, medium, strong
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  const { score } = validatePassword(password)

  if (score >= 80) return 'strong'
  if (score >= 60) return 'medium'
  return 'weak'
}

/**
 * MD5 签名（用于请求签名等场景）
 * @param data 要签名的数据对象
 * @param signKey 签名密钥
 * @returns 签名后的字符串
 */
export const generateSignature = (data: Record<string, any>, signKey?: string): string => {
  const SIGN_KEY = signKey || import.meta.env.VITE_SIGN_KEY || 'ADfj3kcadc2349akvm1CPFFCD84f'

  const strs: string[] = []
  for (const key in data) {
    strs.push(`${key}=${data[key]}`)
  }

  strs.sort() // 数组排序
  const sortedStr = strs.join('&') // 数组变字符串

  // 添加签名
  const endData = sortedStr + '&sign=' + CryptoJS.MD5(sortedStr + SIGN_KEY).toString()

  // AES 加密
  const encryptResult = CryptoJS.AES.encrypt(endData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })

  return encodeURIComponent(CryptoJS.enc.Base64.stringify(encryptResult.ciphertext))
}