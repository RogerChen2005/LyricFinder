import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { get_file } from '../services/download.service'

export default async function fileRoutes(app: FastifyInstance): Promise<void> {
  app.post('/file', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      get_file(request.body as { filename: string }, reply)
    } catch (e) {
      request.log.error(e)
      reply.status(500).send('')
    }
  })
}
