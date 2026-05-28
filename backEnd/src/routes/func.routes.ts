import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import * as searchService from '../services/search.service'
import * as playlistService from '../services/playlist.service'
import * as albumService from '../services/album.service'
import * as artistService from '../services/artist.service'
import * as songService from '../services/song.service'
import * as discoverService from '../services/discover.service'
import * as authService from '../services/auth.service'

type ServiceFn = (reply: FastifyReply, data: Record<string, any>) => Promise<string>

const services: Record<string, ServiceFn> = {
  search_all: searchService.search_all,
  search_list: searchService.search_list,
  search_song: searchService.search_song,
  search_album: searchService.search_album,
  search_artist: searchService.search_artist,
  get_song_detail: songService.get_song_detail,
  get_song_url: songService.get_song_url,
  get_lyric: songService.get_lyric,
  get_playlist: playlistService.get_playlist,
  get_list_song: playlistService.get_list_song,
  songlist_detail: playlistService.songlist_detail,
  get_album: albumService.get_album,
  artist_info: artistService.artist_info,
  get_artist_album: artistService.get_artist_album,
  discover: discoverService.discover,
  generate_qr_code: authService.generate_qr_code,
  qr_check: authService.qr_check,
  user_inf: authService.user_inf,
}

async function handle(
  fn: ServiceFn | undefined,
  data: Record<string, any>,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!fn) {
    return reply.status(404).send('')
  }
  try {
    return await fn(reply, data)
  } catch (e) {
    request.log.error(e)
    return reply.status(500).send('')
  }
}

export default async function funcRoutes(app: FastifyInstance): Promise<void> {
  app.post('/func', async (request: FastifyRequest, reply: FastifyReply) => {
    const { target, data } = request.body as { target: string; data: Record<string, any> }
    console.log(`[${new Date().toTimeString()}] ${target}`)
    return handle(services[target], data, request, reply)
  })
}
