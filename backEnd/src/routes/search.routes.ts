import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import * as searchService from '../services/search.service'

export default async function searchRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/search', async (request, reply) => {
    const data = request.body as Record<string, any>
    return searchService.search_all(reply, data)
  })

  app.post('/api/search/song', async (request, reply) => {
    const data = request.body as Record<string, any>
    return searchService.search_song(reply, data)
  })

  app.post('/api/search/list', async (request, reply) => {
    const data = request.body as Record<string, any>
    return searchService.search_list(reply, data)
  })

  app.post('/api/search/album', async (request, reply) => {
    const data = request.body as Record<string, any>
    return searchService.search_album(reply, data)
  })

  app.post('/api/search/artist', async (request, reply) => {
    const data = request.body as Record<string, any>
    return searchService.search_artist(reply, data)
  })
}
