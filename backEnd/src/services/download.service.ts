import { FastifyReply } from 'fastify'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { lyric, song_url_v1 } from '@neteasecloudmusicapienhanced/api'
import { loadCookie, TEMP_PATH, ensureTempPath } from '../config'

const taglib = require('node-taglib-sharp')

taglib.Id3v2Settings.forceDefaultVersion = true
taglib.Id3v2Settings.defaultVersion = 3

ensureTempPath()

function createFileName(
  query: Record<string, any>,
  options: Record<string, any>,
  ext: string,
): string {
  if (options.use_origin_name) {
    const safeName = String(query.origin_name).replace(/[/:*]/g, '_')
    return path.join(TEMP_PATH, safeName + ext)
  }
  let filename = options.mode
    ? `${query.title} - ${query.artists}`
    : `${query.artists} - ${query.title}`
  filename = filename.replace(/\//g, '_')
  filename = filename.replace(/\*/g, '＊')
  filename = filename.replace(/:/g, '：')
  return path.join(TEMP_PATH, `${filename}.${ext}`)
}

function comp(t1: string, t2: string): boolean {
  if (t1.length === 0) return false
  if (t2.length === 0) return true
  const a1 = t1.split(':').map(Number)
  const a2 = t2.split(':').map(Number)
  if (a1[0] === a2[0]) return a1[1] <= a2[1]
  return a1[0] < a2[0]
}

export async function lyric_download(
  data: Record<string, any>,
  reply: FastifyReply,
): Promise<string> {
  const options = data.options
  const query = data.query
  const result = await lyric({ id: query.id, realIP: "116.25.146.177" })
  const body = result.body as any
  const saveName = createFileName(query, options, 'lrc')
  const savePath = path.join(TEMP_PATH, saveName)

  try {
    if (options.tlyric && body.tlyric && body.tlyric.lyric) {
      const res: string[] = []
      let lyricLines = body.lrc.lyric.split('\n')
      let tlyricLines = body.tlyric.lyric.split('\n')
      if (!Number(tlyricLines[0][1])) {
        tlyricLines = tlyricLines.slice(1)
      }
      const start1 = lyricLines[0].indexOf('[') + 1
      const start2 = tlyricLines[0].indexOf('[') + 1
      const end1 = lyricLines[0].indexOf(']')
      const end2 = tlyricLines[0].indexOf(']')
      let i = 0
      let j = 0
      while (lyricLines.length > i && tlyricLines.length > j) {
        const s1 = lyricLines[i]
        const s2 = tlyricLines[j]
        if (comp(s1.slice(start1, end1), s2.slice(start2, end2))) {
          res.push(s1)
          i++
        } else {
          res.push(s2)
          j++
        }
      }
      fs.writeFileSync(savePath, res.join('\n'))
    } else {
      fs.writeFileSync(savePath, body.lrc.lyric)
    }
    reply.status(200)
    return JSON.stringify({ filename: saveName })
  } catch (e) {
    console.log(e)
    reply.status(404)
    return ''
  }
}

export async function music_download(
  data: Record<string, any>,
  reply: FastifyReply,
): Promise<string> {
  const options = data.options
  const query = data.query
  const result = await song_url_v1({
    id: query.id,
    cookie: loadCookie(),
    level: options.level,
    realIP: "116.25.146.177",
  })
  const body = result.body as any
  const url = body.data[0].url
  const type = body.data[0].type
  const saveName = createFileName(query, options, type)
  const savePath = path.join(TEMP_PATH, saveName)
  const stream = fs.createWriteStream(savePath)

  const dlResponse = await axios({ url, responseType: 'stream' })
  dlResponse.data.pipe(stream)

  return new Promise((resolve) => {
    stream.on('finish', () => {
      axios({ url: query.album_img, method: 'GET', responseType: 'arraybuffer' })
        .then(async (body) => {
          const cover = {
            data: taglib.ByteVector.fromByteArray(Buffer.from(body.data)),
            mimeType: 'image/jpeg',
            type: taglib.PictureType.FrontCover,
          }
          const dest = taglib.File.createFromPath(savePath)
          dest.tag.pictures = [cover]
          dest.tag.title = query.title
          dest.tag.album = query.album
          dest.tag.performers = query.artists.split(',')
          dest.save()
          dest.dispose()
          reply.status(200)
          resolve(JSON.stringify({ filename: saveName }))
        })
    })
  })
}

export function get_file(body: { filename: string }, reply: FastifyReply): void {
  const filepath = path.join(TEMP_PATH, body.filename)
  if (fs.existsSync(filepath)) {
    const filename = path.basename(body.filename)
    reply.header('Content-Type', 'application/octet-stream')
    reply.header('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    const readStream = fs.createReadStream(filepath)
    readStream.on('close', () => {
      fs.rmSync(filepath)
    })
    reply.send(readStream)
  } else {
    reply.status(404).send('')
  }
}
