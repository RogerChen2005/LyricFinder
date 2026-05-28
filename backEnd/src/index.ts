import Fastify from 'fastify'
import { PORT } from './config'
import searchRoutes from './routes/search.routes'
import songRoutes from './routes/song.routes'
import playlistRoutes from './routes/playlist.routes'
import albumRoutes from './routes/album.routes'
import artistRoutes from './routes/artist.routes'
import discoverRoutes from './routes/discover.routes'
import authRoutes from './routes/auth.routes'
import downloadRoutes from './routes/download.routes'

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

  await app.register(searchRoutes)
  await app.register(songRoutes)
  await app.register(playlistRoutes)
  await app.register(albumRoutes)
  await app.register(artistRoutes)
  await app.register(discoverRoutes)
  await app.register(authRoutes)
  await app.register(downloadRoutes)

  try {
    await app.listen({ port: PORT, host: '127.0.0.1' })
    console.log(`Fastify server is running at http://127.0.0.1:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
