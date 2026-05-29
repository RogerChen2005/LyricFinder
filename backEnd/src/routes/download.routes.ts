import { FastifyInstance } from 'fastify'
import * as downloadService from '../services/download.service'

export default async function downloadRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/download/music', async (request, reply) => {
    const data = request.body as Record<string, any>
    return downloadService.music_download(data, reply)
  })

  app.post('/api/download/lyric', async (request, reply) => {
    const data = request.body as Record<string, any>
    return downloadService.lyric_download(data, reply)
  })

  app.post('/api/file', (request, reply) => {
    downloadService.get_file(request.body as { filename: string }, reply)
  })
}
