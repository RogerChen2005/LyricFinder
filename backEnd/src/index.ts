import Fastify from 'fastify'
import { PORT } from './config'
import funcRoutes from './routes/func.routes'
import downloadRoutes from './routes/download.routes'
import fileRoutes from './routes/file.routes'

async function start() {
  const app = Fastify({ logger: true })

  app.addContentTypeParser(
    'application/json',
    { parseAs: 'string' },
    (_req, body, _done) => {
      try {
        return JSON.parse(body as string)
      } catch {
        return body
      }
    },
  )

  await app.register(funcRoutes)
  await app.register(downloadRoutes)
  await app.register(fileRoutes)

  try {
    await app.listen({ port: PORT, host: '127.0.0.1' })
    console.log(`Fastify server is running at http://127.0.0.1:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
