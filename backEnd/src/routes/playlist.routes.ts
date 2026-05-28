import { FastifyInstance } from 'fastify'
import * as playlistService from '../services/playlist.service'

export default async function playlistRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/playlist', async (request, reply) => {
    const data = request.body as Record<string, any>
    return playlistService.get_playlist(reply, data)
  })

  app.post('/api/playlist/song', async (request, reply) => {
    const data = request.body as Record<string, any>
    return playlistService.get_list_song(reply, data)
  })

  app.post('/api/playlist/detail', async (request, reply) => {
    const data = request.body as Record<string, any>
    return playlistService.songlist_detail(reply, data)
  })
}
