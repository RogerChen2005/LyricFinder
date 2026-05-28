import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fs from 'fs'
import { PORT } from './config'
import searchRoutes from './routes/search.routes'
import songRoutes from './routes/song.routes'
import playlistRoutes from './routes/playlist.routes'
import albumRoutes from './routes/album.routes'
import artistRoutes from './routes/artist.routes'
import discoverRoutes from './routes/discover.routes'
import authRoutes from './routes/auth.routes'
import downloadRoutes from './routes/download.routes'

const STATIC_DIR = path.join(__dirname, '..', 'static')

async function start() {
  const app = Fastify({ logger: true })

  if (fs.existsSync(STATIC_DIR)) {
    await app.register(fastifyStatic, {
      root: STATIC_DIR,
      prefix: '/',
      index: ['index.html'],
      decorateReply: true,
    })
  }

  await app.register(searchRoutes)
  await app.register(songRoutes)
  await app.register(playlistRoutes)
  await app.register(albumRoutes)
  await app.register(artistRoutes)
  await app.register(discoverRoutes)
  await app.register(authRoutes)
  await app.register(downloadRoutes)

  if (fs.existsSync(STATIC_DIR)) {
    app.setNotFoundHandler((_request, reply) => {
      reply.sendFile('index.html')
    })
  }

  try {
    await app.listen({ port: PORT, host: '127.0.0.1' })
    console.log(`Fastify server is running at http://127.0.0.1:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
