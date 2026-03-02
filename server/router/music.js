const Router = require('koa-router')
const router = new Router({ prefix: '/music' })
const axios = require('axios')
const config = require('../config')
const http = require('http')
const https = require('https')
const { readConfig, writeConfig, maskCookie } = require('../utils/musicConfig')

// 统一响应格式
const responseHandler = (ctx, data, code = 200, message = 'success') => {
  const isPlainObject = data && typeof data === 'object' && !Array.isArray(data)
  ctx.body = isPlainObject
    ? { code, data, message, ...data }
    : { code, data, message }
}

const normalizeCookie = (value) => {
  if (!value) return ''
  if (Array.isArray(value)) {
    return value.map(item => String(item || '').trim()).filter(Boolean).join('; ')
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')
      .trim()
  }
  return String(value).trim()
}

const getMusicConfig = () => readConfig()

const callMusicApiGet = async (path, params = {}, withCookie = true) => {
  const cfg = getMusicConfig()
  const query = { ...params }
  const cookie = normalizeCookie(cfg.neteaseCookie)
  if (withCookie && cookie) {
    query.cookie = cookie
  }
  const { data } = await axios.get(`${config.MUSIC_API_URL}${path}`, { params: query })
  return data
}

const formatPlaylist = (playlist) => {
  const tracks = (playlist.tracks || []).map(track => ({
    id: track.id,
    name: track.name,
    artist: (track.ar || []).map(a => a.name).join('/'),
    album: track.al ? track.al.name : '',
    cover: track.al ? track.al.picUrl : '',
    url: ''
  }))

  return {
    id: playlist.id,
    name: playlist.name,
    cover: playlist.coverImgUrl,
    description: playlist.description,
    tracks
  }
}

const fetchPlaylistDetail = async (playlistId) => {
  const data = await callMusicApiGet('/playlist/detail', { id: playlistId }, true)
  if (data.code !== 200 || !data.playlist) {
    return null
  }
  return formatPlaylist(data.playlist)
}

const resolvePlayableSong = async (id) => {
  const resolvers = [
    { path: '/song/url/v1', params: { id, level: 'standard' } },
    { path: '/song/url', params: { id } }
  ]

  for (const resolver of resolvers) {
    try {
      const data = await callMusicApiGet(resolver.path, resolver.params, true)
      const song = data && data.data && data.data[0]
      if (data.code === 200 && song && song.url) {
        return song
      }
    } catch (error) {
      console.warn(`解析歌曲 URL 失败 (${resolver.path}):`, error.message)
    }
  }

  return null
}

const getNeteaseLoginStatus = async () => {
  const cfg = getMusicConfig()
  const cookie = normalizeCookie(cfg.neteaseCookie)
  if (!cookie) {
    return {
      hasCookie: false,
      cookieMasked: '',
      loggedIn: false,
      defaultPlaylistId: cfg.defaultPlaylistId,
      updatedAt: cfg.updatedAt || ''
    }
  }

  try {
    const data = await callMusicApiGet('/login/status', { timestamp: Date.now() }, true)
    const loginData = data?.data || {}
    return {
      hasCookie: true,
      cookieMasked: maskCookie(cookie),
      loggedIn: !!loginData.account,
      account: loginData.account || null,
      profile: loginData.profile || null,
      defaultPlaylistId: cfg.defaultPlaylistId,
      updatedAt: cfg.updatedAt || ''
    }
  } catch (error) {
    return {
      hasCookie: true,
      cookieMasked: maskCookie(cookie),
      loggedIn: false,
      error: error.message,
      defaultPlaylistId: cfg.defaultPlaylistId,
      updatedAt: cfg.updatedAt || ''
    }
  }
}

// ========= 管理员接口 =========

router.get('/admin/status', async (ctx) => {
  const status = await getNeteaseLoginStatus()
  responseHandler(ctx, status)
})

router.put('/admin/config', async (ctx) => {
  const body = ctx.request.body || {}
  const patch = {}

  if (Object.prototype.hasOwnProperty.call(body, 'neteaseCookie')) {
    patch.neteaseCookie = normalizeCookie(body.neteaseCookie)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'defaultPlaylistId')) {
    patch.defaultPlaylistId = String(body.defaultPlaylistId || '').trim()
  }

  if (
    Object.prototype.hasOwnProperty.call(patch, 'defaultPlaylistId') &&
    (!patch.defaultPlaylistId || !/^\d+$/.test(patch.defaultPlaylistId))
  ) {
    return responseHandler(ctx, null, 400, 'defaultPlaylistId 必须是纯数字歌单 ID')
  }

  const next = writeConfig(patch)
  responseHandler(ctx, {
    hasCookie: !!normalizeCookie(next.neteaseCookie),
    cookieMasked: maskCookie(next.neteaseCookie),
    defaultPlaylistId: next.defaultPlaylistId,
    updatedAt: next.updatedAt
  })
})

router.post('/admin/cookie/clear', async (ctx) => {
  const next = writeConfig({ neteaseCookie: '' })
  responseHandler(ctx, {
    hasCookie: false,
    cookieMasked: '',
    defaultPlaylistId: next.defaultPlaylistId,
    updatedAt: next.updatedAt
  })
})

router.post('/admin/qr/start', async (ctx) => {
  try {
    const keyData = await callMusicApiGet('/login/qr/key', { timestamp: Date.now() }, false)
    const key = keyData?.data?.unikey
    if (!key) {
      return responseHandler(ctx, null, 500, '获取二维码 key 失败')
    }

    const qrData = await callMusicApiGet(
      '/login/qr/create',
      { key, qrimg: true, platform: 'web', timestamp: Date.now() },
      false
    )
    const qrimg = qrData?.data?.qrimg || ''
    const qrurl = qrData?.data?.qrurl || ''

    responseHandler(ctx, { key, qrimg, qrurl })
  } catch (error) {
    responseHandler(ctx, null, 500, `二维码生成失败: ${error.message}`)
  }
})

router.get('/admin/qr/check', async (ctx) => {
  const key = String(ctx.query.key || '').trim()
  if (!key) {
    return responseHandler(ctx, null, 400, '缺少 key')
  }

  try {
    const data = await callMusicApiGet('/login/qr/check', { key, timestamp: Date.now() }, false)
    const stateCode = Number(data?.code ?? data?.data?.code ?? 0)

    // 803: 授权登录成功
    if (stateCode === 803) {
      const cookie = normalizeCookie(data?.cookie || data?.data?.cookie || '')
      if (cookie) {
        writeConfig({ neteaseCookie: cookie })
      }
      const status = await getNeteaseLoginStatus()
      return responseHandler(ctx, {
        stateCode,
        stateMessage: data?.message || '授权成功',
        ...status
      })
    }

    responseHandler(ctx, {
      stateCode,
      stateMessage: data?.message || ''
    })
  } catch (error) {
    responseHandler(ctx, null, 500, `二维码状态查询失败: ${error.message}`)
  }
})

// ========= 播放相关接口 =========

// 获取默认歌单（管理员配置）
router.get('/playlist/default', async (ctx) => {
  const { defaultPlaylistId } = getMusicConfig()
  try {
    const detail = await fetchPlaylistDetail(defaultPlaylistId)
    if (!detail) {
      return responseHandler(ctx, null, 404, '默认歌单不存在或不可访问')
    }
    responseHandler(ctx, {
      ...detail,
      configuredPlaylistId: defaultPlaylistId
    })
  } catch (error) {
    console.error('获取默认歌单失败:', error.message)
    responseHandler(ctx, null, 500, `Error: ${error.message}`)
  }
})

// 获取歌单详情
router.get('/playlist/:id', async (ctx) => {
  const { id } = ctx.params
  if (!id) {
    return responseHandler(ctx, null, 400, '缺少歌单 ID')
  }

  try {
    const detail = await fetchPlaylistDetail(id)
    if (!detail) {
      return responseHandler(ctx, null, 404, '获取歌单失败')
    }
    responseHandler(ctx, detail)
  } catch (error) {
    console.error('获取歌单失败:', error.message)
    responseHandler(ctx, null, 500, `Error: ${error.message}`)
  }
})

// 搜索歌曲（供文章编辑页绑定背景音乐使用）
router.get('/search', async (ctx) => {
  const keyword = String(ctx.query.keyword || ctx.query.keywords || '').trim()
  const parsedLimit = parseInt(ctx.query.limit || '20', 10) || 20
  const limit = Math.min(Math.max(parsedLimit, 1), 50)
  const parsedPage = parseInt(ctx.query.page || '1', 10) || 1
  const page = Math.max(parsedPage, 1)
  const parsedOffset = parseInt(ctx.query.offset || `${(page - 1) * limit}`, 10)
  const offset = Math.max(parsedOffset, 0)

  if (!keyword) {
    return responseHandler(ctx, [], 400, '缺少搜索关键词')
  }

  try {
    const data = await callMusicApiGet('/search', { keywords: keyword, limit, offset }, true)

    if (data.code !== 200) {
      return responseHandler(ctx, [], data.code || 500, '搜索歌曲失败')
    }

    const songs = (data.result?.songs || []).map(song => ({
      id: song.id,
      name: song.name,
      artist: (song.artists || []).map(a => a.name).join('/'),
      album: song.album?.name || '',
      cover: song.album?.picUrl || ''
    }))

    const total = Number(data.result?.songCount || songs.length || 0)
    const currentPage = Math.floor(offset / limit) + 1

    ctx.body = {
      code: 200,
      data: songs,
      message: 'success',
      pagination: {
        total,
        page: currentPage,
        pageSize: limit,
        hasMore: offset + songs.length < total
      }
    }
  } catch (error) {
    console.error('搜索歌曲失败:', error.message)
    responseHandler(ctx, [], 500, `Error: ${error.message}`)
  }
})

// 获取歌曲 URL
router.get('/url/:id', async (ctx) => {
  const { id } = ctx.params
  try {
    const song = await resolvePlayableSong(id)
    if (song) {
      responseHandler(ctx, {
        url: `/api/music/proxy/${id}`,
        type: song.type,
        size: song.size,
        br: song.br,
        proxy: true
      })
    } else {
      responseHandler(ctx, null, 404, '歌曲暂不可播放')
    }
  } catch (error) {
    console.error('获取歌曲 URL 失败:', error.message)
    responseHandler(ctx, null, 500, error.message)
  }
})

// 代理播放音频 (解决 CORS 和 403 Forbidden 问题)
router.get('/proxy/:id', async (ctx) => {
  const { id } = ctx.params
  try {
    const song = await resolvePlayableSong(id)
    if (!song || !song.url) {
      ctx.status = 404
      ctx.body = 'Song is not playable'
      return
    }

    const targetUrl = song.url
    const range = ctx.header.range

    await new Promise((resolve) => {
      const fetchLib = targetUrl.startsWith('https') ? https : http
      const options = {
        headers: {
          Referer: 'https://music.163.com/',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          ...(range && { Range: range })
        }
      }

      fetchLib
        .get(targetUrl, options, (res) => {
          ctx.status = res.statusCode
          const forwardHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges']
          forwardHeaders.forEach(h => {
            if (res.headers[h]) {
              ctx.set(
                h
                  .split('-')
                  .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                  .join('-'),
                res.headers[h]
              )
            }
          })
          ctx.set('Access-Control-Allow-Origin', '*')
          ctx.body = res
          resolve()
        })
        .on('error', e => {
          console.error('Proxy Stream Error:', e)
          ctx.status = 500
          ctx.body = 'Proxy Stream Error'
          resolve()
        })
    })
  } catch (error) {
    console.error('代理音频失败:', error.message)
    ctx.status = 500
  }
})

// 获取歌词
router.get('/lyric/:id', async (ctx) => {
  const { id } = ctx.params
  try {
    const data = await callMusicApiGet('/lyric', { id }, true)
    if (data.code === 200) {
      responseHandler(ctx, {
        lrc: data.lrc ? data.lrc.lyric : '',
        tlyric: data.tlyric ? data.tlyric.lyric : ''
      })
    } else {
      responseHandler(ctx, null, data.code, '获取歌词失败')
    }
  } catch (error) {
    responseHandler(ctx, null, 500, error.message)
  }
})

module.exports = router
