import { FastifyInstance } from 'fastify'
import * as discoverService from '../services/discover.service'

export default async function discoverRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/discover', async (request, reply) => {
    const data = request.body as Record<string, any>
    return discoverService.discover(reply, data)
  })
}
