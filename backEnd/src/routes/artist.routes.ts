import { FastifyInstance } from 'fastify'
import * as artistService from '../services/artist.service'

export default async function artistRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/artist/info', async (request, reply) => {
    const data = request.body as Record<string, any>
    return artistService.artist_info(reply, data)
  })

  app.post('/api/artist/album', async (request, reply) => {
    const data = request.body as Record<string, any>
    return artistService.get_artist_album(reply, data)
  })
}
