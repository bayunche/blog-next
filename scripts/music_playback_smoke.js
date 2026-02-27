#!/usr/bin/env node

const API = process.env.API_BASE || 'http://127.0.0.1:6062'
const SAMPLE_SIZE = Number(process.env.MUSIC_SMOKE_SIZE || 8)

async function getJson(url) {
  const res = await fetch(url)
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch (_) {}
  return { res, json, text }
}

async function checkTrack(track) {
  const id = String(track.id)
  const urlApi = await getJson(`${API}/music/url/${id}`)
  const urlOk =
    urlApi.res.status === 200 &&
    urlApi.json?.code === 200 &&
    urlApi.json?.data?.url === `/api/music/proxy/${id}`

  let proxyOk = false
  let proxyStatus = 0
  let bytes = 0
  if (urlOk) {
    const proxyRes = await fetch(`${API}/music/proxy/${id}`, {
      headers: { Range: 'bytes=0-8191' }
    })
    proxyStatus = proxyRes.status
    const buf = await proxyRes.arrayBuffer()
    bytes = buf.byteLength
    proxyOk = [200, 206].includes(proxyStatus) && bytes > 0
  }

  return {
    id,
    name: track.name,
    artist: track.artist,
    urlOk,
    proxyOk,
    proxyStatus,
    bytes,
    playable: urlOk && proxyOk
  }
}

;(async () => {
  const result = {
    at: new Date().toISOString(),
    api: API,
    playlist: null,
    checked: 0,
    playable: 0,
    items: [],
    pass: false
  }

  const playlistRes = await getJson(`${API}/music/playlist/default`)
  if (!(playlistRes.res.status === 200 && playlistRes.json?.code === 200 && Array.isArray(playlistRes.json?.data?.tracks))) {
    console.log(
      JSON.stringify(
        {
          ...result,
          error: 'default playlist unavailable',
          status: playlistRes.res.status
        },
        null,
        2
      )
    )
    process.exit(1)
  }

  const tracks = playlistRes.json.data.tracks
  result.playlist = {
    id: playlistRes.json.data.id,
    configuredPlaylistId: playlistRes.json.data.configuredPlaylistId,
    totalTracks: tracks.length
  }

  const sample = tracks.slice(0, SAMPLE_SIZE)
  for (const t of sample) {
    const r = await checkTrack(t)
    result.items.push(r)
  }

  result.checked = result.items.length
  result.playable = result.items.filter(i => i.playable).length
  result.pass = result.playable === result.checked

  console.log(JSON.stringify(result, null, 2))
  process.exit(result.pass ? 0 : 2)
})()
