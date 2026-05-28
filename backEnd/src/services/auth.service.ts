import { FastifyReply } from 'fastify'
import { login_qr_key, login_qr_create, login_qr_check, user_account } from '../api'

export async function generate_qr_code(reply: FastifyReply, _query: Record<string, any>) {
  const key = await login_qr_key({})
  const result = await login_qr_create({ key: key.body.data.unikey, qrimg: true })
  reply.status(200)
  return JSON.stringify({ key: key.body.data.unikey, qrimg: result.body.data.qrimg })
}

export async function qr_check(reply: FastifyReply, query: Record<string, any>) {
  const result = await login_qr_check({ key: query.key })
  console.log(result.body)
  if (result) {
    reply.status(200)
    return JSON.stringify({ code: result.body.code, cookie: result.body.cookie })
  }
  reply.status(500)
  return ''
}

export async function user_inf(reply: FastifyReply, query: Record<string, any>) {
  const result = await user_account({ cookie: query.cookie })
  if (result.body.profile) {
    reply.status(200)
    return JSON.stringify({
      userid: result.body.profile.userId,
      nickname: result.body.profile.nickname,
      avatarUrl: result.body.profile.avatarUrl,
      backgroundUrl: result.body.profile.backgroundUrl,
      signature: result.body.profile.signature,
      isvip: result.body.account.paidFee,
      status: result.body.account.status,
    })
  }
  reply.status(404)
  return ''
}
