const test = require('node:test')
const assert = require('node:assert/strict')
const { Readable } = require('stream')
const request = require('supertest')

const { createRouteTestApp, loadRouteModule } = require('../helpers/createRouteTestApp')
const { adminToken } = require('../helpers/testTokens')

function createMusicRoute(overrides = {}) {
  const state = {
    config: {
      neteaseCookie: 'MUSIC_U=test-cookie',
      defaultPlaylistId: '123456',
      updatedAt: '2026-03-27T00:00:00.000Z',
    },
    getCalls: [],
    ...overrides,
  }

  const axiosStub = {
    get: async (url, options = {}) => {
      state.getCalls.push({ url, options })

      if (url.includes('/login/status')) {
        return { data: { data: { account: { id: 1 }, profile: { nickname: 'tester' } } } }
      }
      if (url.includes('/playlist/detail')) {
        return {
          data: {
            code: 200,
            playlist: {
              id: 123456,
              name: 'Default Playlist',
              coverImgUrl: 'cover.jpg',
              description: 'playlist',
              tracks: [
                {
                  id: 1,
                  name: 'Song One',
                  ar: [{ name: 'Artist' }],
                  al: { name: 'Album', picUrl: 'album.jpg' },
                },
              ],
            },
          },
        }
      }
      if (url.includes('/search')) {
        return {
          data: {
            code: 200,
            result: {
              songCount: 1,
              songs: [
                {
                  id: 1,
                  name: 'Song One',
                  artists: [{ name: 'Artist' }],
                  album: { name: 'Album', picUrl: 'album.jpg' },
                },
              ],
            },
          },
        }
      }
      if (url.includes('/song/url/v1') || url.includes('/song/url')) {
        return { data: { code: 200, data: [{ url: 'https://audio.example/song.mp3', type: 'mp3', size: 42, br: 320000 }] } }
      }
      if (url.includes('/lyric')) {
        return { data: { code: 200, lrc: { lyric: 'hello' }, tlyric: { lyric: 'world' } } }
      }
      if (url.includes('/login/qr/key')) {
        return { data: { data: { unikey: 'qr-key' } } }
      }
      if (url.includes('/login/qr/create')) {
        return { data: { data: { qrimg: 'data:image/png;base64,abc', qrurl: 'https://music.163.com/qr' } } }
      }
      if (url.includes('/login/qr/check')) {
        return { data: { code: 803, message: 'authorized', cookie: 'MUSIC_U=new-cookie' } }
      }

      throw new Error(`Unhandled axios.get call for ${url}`)
    },
  }

  const httpStub = {
    get: (targetUrl, options, callback) => {
      const response = new Readable({
        read() {
          this.push('music-stream')
          this.push(null)
        },
      })
      response.statusCode = 200
      response.headers = {
        'content-type': 'audio/mpeg',
        'content-length': '12',
      }
      callback(response)
      return { on: () => ({}) }
    },
  }

  const httpsStub = httpStub

  const route = loadRouteModule('../../router/music', {
    axios: axiosStub,
    '../config': { MUSIC_API_URL: 'http://music-api.test' },
    '../utils/musicConfig': {
      readConfig: () => ({ ...state.config }),
      writeConfig: patch => {
        state.config = { ...state.config, ...patch, updatedAt: '2026-03-27T12:00:00.000Z' }
        return state.config
      },
      maskCookie: value => (value ? '***masked***' : ''),
    },
    http: httpStub,
    https: httpsStub,
  })

  return { route, state }
}

test('music admin and playlist endpoints respond with mocked upstream data', async () => {
  const { route } = createMusicRoute()
  const app = createRouteTestApp([route])

  const status = await request(app.callback())
    .get('/music/admin/status')
    .set('Authorization', adminToken())
  assert.equal(status.status, 200)
  assert.equal(status.body.code, 200)
  assert.equal(status.body.data.loggedIn, true)

  const playlist = await request(app.callback()).get('/music/playlist/default')
  assert.equal(playlist.status, 200)
  assert.equal(playlist.body.data.name, 'Default Playlist')

  const lyric = await request(app.callback()).get('/music/lyric/1')
  assert.equal(lyric.status, 200)
  assert.equal(lyric.body.data.lrc, 'hello')
})

test('music admin config endpoints require admin auth', async () => {
  const { route, state } = createMusicRoute()
  const app = createRouteTestApp([route])

  const unauthenticated = await request(app.callback()).put('/music/admin/config').send({ defaultPlaylistId: '88' })
  assert.equal(unauthenticated.status, 401)

  const authenticated = await request(app.callback())
    .put('/music/admin/config')
    .set('Authorization', adminToken())
    .send({ defaultPlaylistId: '88' })
  assert.equal(authenticated.status, 200)
  assert.equal(authenticated.body.data.defaultPlaylistId, '88')
  assert.equal(state.config.defaultPlaylistId, '88')
})

test('music search, url, and proxy endpoints stay callable with mocked upstreams', async () => {
  const { route } = createMusicRoute()
  const app = createRouteTestApp([route])

  const search = await request(app.callback()).get('/music/search').query({ keyword: 'hello' })
  assert.equal(search.status, 200)
  assert.equal(search.body.data[0].name, 'Song One')

  const url = await request(app.callback()).get('/music/url/1')
  assert.equal(url.status, 200)
  assert.equal(url.body.data.proxy, true)

  const proxy = await request(app.callback()).get('/music/proxy/1')
  assert.equal(proxy.status, 200)
  assert.match(proxy.headers['content-type'] || '', /audio\/mpeg/)
})
