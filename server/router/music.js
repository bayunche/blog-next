const Router = require('koa-router')
const router = new Router({ prefix: '/music' })
const { playlist_detail, song_url, lyric, song_detail } = require('NeteaseCloudMusicApi')

// 统一响应格式
const responseHandler = (ctx, data, code = 200, message = 'success') => {
    ctx.body = {
        code,
        data,
        message
    }
}

// 获取歌单详情
router.get('/playlist/:id', async (ctx) => {
    const { id } = ctx.params
    if (!id) {
        return responseHandler(ctx, null, 400, '缺少歌单 ID')
    }

    try {
        // 1. 获取歌单详情
        const result = await playlist_detail({
            id,
            realIP: '116.25.146.177' // 尝试绕过 IP 限制
        })

        if (result.body.code !== 200) {
            return responseHandler(ctx, null, result.body.code, '获取歌单失败')
        }

        const playlist = result.body.playlist
        const trackIds = playlist.trackIds.map(t => t.id).join(',')

        // 2. 获取歌曲详情（为了获取封面等信息，虽然 playlist_detail 也有，但 song_detail 更全）
        // 其实 playlist.tracks 通常已经包含了大部分信息，这里直接用 playlist.tracks
        // 但有时候 trackIds 会比 tracks 多（分页），为了简单，我们暂且只取前 20 首或 playlist.tracks

        // 3. 获取歌曲 URL (为了能够播放，我们最好预先获取 URL 或者前端播放时再获取)
        // 这里我们只返回歌单基础信息，URL 由前端播放时单独请求 /url/:id

        // 格式化返回数据
        const tracks = playlist.tracks.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.ar.map(a => a.name).join('/'),
            album: track.al.name,
            cover: track.al.picUrl,
            // 暂时不返回 url，前端播放时再请求，避免 url 过期
            url: ''
        }))

        responseHandler(ctx, {
            id: playlist.id,
            name: playlist.name,
            cover: playlist.coverImgUrl,
            description: playlist.description,
            tracks
        })

    } catch (error) {

        console.error('获取歌单失败:', error)
        const errMsg = typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error);
        responseHandler(ctx, null, 500, `Error: ${errMsg}`)
    }
})

// 获取歌曲 URL
router.get('/url/:id', async (ctx) => {
    const { id } = ctx.params
    try {
        const result = await song_url({
            id,
            cookie: ''
        })

        if (result.body.code === 200 && result.body.data && result.body.data[0] && result.body.data[0].url) {
            const song = result.body.data[0]
            responseHandler(ctx, {
                url: song.url,
                type: song.type,
                size: song.size,
                br: song.br
            })
        } else {
            // Fallback to standard URL structure
            responseHandler(ctx, {
                url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
                type: 'mp3',
                fallback: true
            })
        }
    } catch (error) {
        console.error('获取歌曲 URL 失败:', error)
        responseHandler(ctx, null, 500, error.message)
    }
})

// 代理播放音频 (解决 CORS 和 403 Forbidden 问题)
// 前端 <audio src="/api/music/proxy/:id" />
const http = require('http');
const https = require('https');

router.get('/proxy/:id', async (ctx) => {
    const { id } = ctx.params
    try {
        // 1. 先获取 URL
        const result = await song_url({ id, cookie: '' })
        if (result.body.code !== 200 || !result.body.data[0]?.url) {
            ctx.status = 404
            return
        }

        const targetUrl = result.body.data[0].url

        // 2. 代理流
        // 需要处理 Range 请求以支持进度条拖动
        const range = ctx.header.range

        // 这是一个简化的流代理，生产环境建议用 Nginx 或专门的模块
        await new Promise((resolve, reject) => {
            const fetchLib = targetUrl.startsWith('https') ? https : http;
            const options = {
                headers: {
                    'Referer': 'https://music.163.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    ...(range && { Range: range })
                }
            };

            fetchLib.get(targetUrl, options, (res) => {
                ctx.status = res.statusCode
                // 转发头部
                if (res.headers['content-type']) ctx.set('Content-Type', res.headers['content-type'])
                if (res.headers['content-length']) ctx.set('Content-Length', res.headers['content-length'])
                if (res.headers['content-range']) ctx.set('Content-Range', res.headers['content-range'])
                if (res.headers['accept-ranges']) ctx.set('Accept-Ranges', res.headers['accept-ranges'])

                // 允许跨域
                ctx.set('Access-Control-Allow-Origin', '*')

                ctx.body = res
                resolve()
            }).on('error', (e) => {
                console.error('Proxy Error:', e)
                ctx.status = 500
                ctx.body = 'Proxy Error'
                resolve()
            })
        })

    } catch (error) {
        console.error('代理音频失败:', error)
        ctx.status = 500
    }
})


// 获取歌词
router.get('/lyric/:id', async (ctx) => {
    const { id } = ctx.params
    try {
        const result = await lyric({
            id,
            cookie: ''
        })

        if (result.body.code === 200) {
            responseHandler(ctx, {
                lrc: result.body.lrc?.lyric || '',
                tlyric: result.body.tlyric?.lyric || ''
            })
        } else {
            responseHandler(ctx, null, result.body.code, '获取歌词失败')
        }
    } catch (error) {
        responseHandler(ctx, null, 500, error.message)
    }
})

module.exports = router
