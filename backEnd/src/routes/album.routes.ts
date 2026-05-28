import { FastifyInstance } from 'fastify'
import * as albumService from '../services/album.service'

export default async function albumRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/album', async (request, reply) => {
    const data = request.body as Record<string, any>
    return albumService.get_album(reply, data)
  })
}
