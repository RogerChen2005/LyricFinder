import { FastifyReply } from 'fastify'
import { homepage_block_page } from '../api'
import { homepage_format } from '../lib/homepage_format'

export async function discover(reply: FastifyReply, query: Record<string, any>) {
  const result = await homepage_block_page({ cookie: query.cookie })
  if (result.body.data) {
    const formated = homepage_format(result.body.data)
    reply.status(200)
    return JSON.stringify(formated)
  }
  reply.status(404)
  return ''
}
