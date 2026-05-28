import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import * as downloadService from '../services/download.service'

type DownloadFn = (
  data: Record<string, any>,
  reply: FastifyReply,
) => Promise<string> | undefined

const downloadFns: Record<string, DownloadFn> = {
  music_download: downloadService.music_download,
  lyric_download: downloadService.lyric_download,
}

export default async function downloadRoutes(app: FastifyInstance): Promise<void> {
  app.post('/download', async (request: FastifyRequest, reply: FastifyReply) => {
    const { target, data } = request.body as { target: string; data: Record<string, any> }
    console.log(`[${new Date().toTimeString()}] ${target}`)
    const fn = downloadFns[target]
    if (!fn) {
      return reply.status(404).send('')
    }
    try {
      return await fn(data, reply)
    } catch (e) {
      request.log.error(e)
      return reply.status(500).send('')
    }
  })
}
