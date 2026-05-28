import { FastifyInstance } from 'fastify'
import * as songService from '../services/song.service'

export default async function songRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/song/detail', async (request, reply) => {
    const data = request.body as Record<string, any>
    return songService.get_song_detail(reply, data)
  })

  app.post('/api/song/url', async (request, reply) => {
    const data = request.body as Record<string, any>
    return songService.get_song_url(reply, data)
  })

  app.post('/api/song/lyric', async (request, reply) => {
    const data = request.body as Record<string, any>
    return songService.get_lyric(reply, data)
  })
}
