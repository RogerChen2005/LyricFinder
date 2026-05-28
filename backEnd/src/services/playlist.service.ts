import { FastifyReply } from 'fastify'
import { user_playlist, playlist_track_all, playlist_detail } from '../api'
import { artists_conv } from '../lib/artists'

export async function get_playlist(reply: FastifyReply, query: Record<string, any>) {
  const result: any[] = []
  for (let offset = 0; ; offset += 30) {
    const value = await user_playlist({ uid: query.uid, limit: 30, offset })
    for (const i of value.body.playlist) {
      result.push({
        list_name: i.name,
        id: i.id,
        img_url: i.coverImgUrl,
        count: i.trackCount,
      })
    }
    if (value.body.more === false) break
  }
  reply.status(200)
  return JSON.stringify({ list: result })
}

export async function get_list_song(reply: FastifyReply, query: Record<string, any>) {
  const result = await playlist_track_all({
    id: query.id,
    limit: 30,
    offset: query.offset,
    cookie: query.cookie,
  })
  const data: any[] = []
  for (const i of result.body.songs) {
    data.push({
      title: i.name,
      id: i.id,
      artists: artists_conv(i.ar),
      album: { name: i.al.name, id: i.al.id, cover: i.al.picUrl },
    })
  }
  reply.status(200)
  return JSON.stringify({ songs: data })
}

export async function songlist_detail(reply: FastifyReply, query: Record<string, any>) {
  try {
    const result = await playlist_detail({ id: query.id, cookie: query.cookie })
    const songlist = result.body.playlist
    reply.status(200)
    return JSON.stringify({
      name: songlist.name,
      cover_img: songlist.coverImgUrl,
      create_time: songlist.createTime,
      count: songlist.trackCount,
      description: songlist.description,
    })
  } catch (e) {
    console.log(e)
    reply.status(500)
    return ''
  }
}
