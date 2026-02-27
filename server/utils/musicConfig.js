const fs = require('fs')
const path = require('path')

const DATA_DIR = path.resolve(__dirname, '../data')
const CONFIG_PATH = path.join(DATA_DIR, 'music-config.json')

const DEFAULT_CONFIG = {
  neteaseCookie: '',
  defaultPlaylistId: process.env.DEFAULT_MUSIC_PLAYLIST_ID || '3778678',
  updatedAt: ''
}

function ensureConfigFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8')
  }
}

function readConfig() {
  ensureConfigFile()
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      neteaseCookie: String(parsed?.neteaseCookie || '').trim(),
      defaultPlaylistId: String(parsed?.defaultPlaylistId || DEFAULT_CONFIG.defaultPlaylistId).trim()
    }
  } catch (error) {
    return { ...DEFAULT_CONFIG }
  }
}

function writeConfig(patch = {}) {
  const current = readConfig()
  const next = {
    ...current,
    ...patch,
    neteaseCookie: String(patch.neteaseCookie ?? current.neteaseCookie ?? '').trim(),
    defaultPlaylistId: String(patch.defaultPlaylistId ?? current.defaultPlaylistId ?? DEFAULT_CONFIG.defaultPlaylistId).trim(),
    updatedAt: new Date().toISOString()
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), 'utf-8')
  return next
}

function maskCookie(cookie) {
  const text = String(cookie || '').trim()
  if (!text) return ''
  if (text.length <= 12) return `${text.slice(0, 4)}****`
  return `${text.slice(0, 6)}...${text.slice(-6)}`
}

module.exports = {
  readConfig,
  writeConfig,
  maskCookie
}
