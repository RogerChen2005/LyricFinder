import { FastifyReply } from 'fastify'
import { album } from '../api'
import { artists_conv } from '../lib/artists'

export async function get_album(reply: FastifyReply, query: Record<string, any>) {
  try {
    const result = await album({ id: query.id })
    const songlist = result.body.album
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
    return JSON.stringify({
      detail: {
        name: songlist.name,
        cover_img: songlist.picUrl,
        create_time: songlist.publishTime,
        count: songlist.size,
        description: songlist.description,
      },
      songs: data,
    })
  } catch (e) {
    console.log(e)
    reply.status(500)
    return ''
  }
}
