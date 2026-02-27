import CryptoJS from 'crypto-js'

// AES encryption key and IV (must match server config)
const key = CryptoJS.enc.Utf8.parse('1234567890000000') // 16 bytes
const iv = CryptoJS.enc.Utf8.parse('1234567890000000')

/**
 * Encrypt password using AES-CBC before sending to server
 */
export function encryptPassword(password: string): string {
    const srcs = CryptoJS.enc.Utf8.parse(password)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.ciphertext.toString()
}
