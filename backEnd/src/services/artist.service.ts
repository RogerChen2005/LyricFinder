import { FastifyReply } from 'fastify'
import { artists, artist_album } from '@neteasecloudmusicapienhanced/api'
import { artists_conv } from '../lib/artists'

export async function artist_info(reply: FastifyReply, query: Record<string, any>) {
  try {
    const result = await artists({ id: query.id })
    const body = result.body as any
    const artist = body.artist
    const data: any[] = []
    for (const i of body.hotSongs) {
      data.push({
        id: i.id,
        title: i.name,
        album: { name: i.al.name, id: i.al.id, cover: i.al.picUrl },
        artists: artists_conv(i.ar),
      })
    }
    reply.status(200)
    return JSON.stringify({
      info: {
        name: artist.name,
        id: artist.id,
        pic: artist.picUrl,
        description: artist.briefDesc,
      },
      songs: data,
    })
  } catch (e) {
    console.log(e)
    reply.status(500)
    return ''
  }
}

export async function get_artist_album(reply: FastifyReply, query: Record<string, any>) {
  const result = await artist_album({ id: query.id, offset: query.offset, limit: 30 })
  const body = result.body as any
  const data: any[] = []
  for (const i of body.hotAlbums) {
    data.push({
      id: i.id,
      name: i.name,
      cover_img: i.picUrl,
      count: i.size,
      artist: i.artist.name,
    })
  }
  reply.status(200)
  return JSON.stringify({ albums: data, count: body.artist.albumSize })
}
