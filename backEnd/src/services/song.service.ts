import { FastifyReply } from 'fastify'
import { song_detail, song_url_v1, lyric } from '../api'
import { artists_conv } from '../lib/artists'
import { loadCookie } from '../config'

export async function get_song_detail(reply: FastifyReply, query: Record<string, any>) {
  const result = await song_detail({ ids: query.id })
  const data = result.body.songs[0]
  reply.status(200)
  return JSON.stringify({
    id: data.id,
    title: data.name,
    artists: artists_conv(data.ar),
    album: { id: data.al.id, name: data.al.name, cover: data.al.picUrl },
  })
}

export async function get_song_url(reply: FastifyReply, query: Record<string, any>) {
  const result = await song_url_v1({ id: query.id, level: query.level, cookie: loadCookie() })
  reply.status(200)
  return JSON.stringify(result.body.data[0])
}

export async function get_lyric(reply: FastifyReply, query: Record<string, any>) {
  const result = await lyric({ id: query.id })
  if (result.body) {
    const data: Record<string, string> = {}
    if (result.body.lrc && result.body.lrc.lyric) data.lyric = result.body.lrc.lyric
    if (result.body.tlyric && result.body.tlyric.lyric) data.tlyric = result.body.tlyric.lyric
    reply.status(200)
    return JSON.stringify(data)
  }
  reply.status(404)
  return ''
}
