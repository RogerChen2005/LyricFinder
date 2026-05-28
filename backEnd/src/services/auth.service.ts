import { FastifyReply } from 'fastify'
import { login_qr_key, login_qr_create, login_qr_check, user_account } from '@neteasecloudmusicapienhanced/api'

export async function generate_qr_code(reply: FastifyReply, _query: Record<string, any>) {
  const key = await login_qr_key({ randomCNIP: true })
  console.log("QR key:", key)
  const keyBody = key.body as any
  const result = await login_qr_create({ key: keyBody.data.unikey, qrimg: true, randomCNIP: true })
  reply.status(200)
  return JSON.stringify({ key: keyBody.data.unikey, qrimg: (result.body as any).data.qrimg })
}

export async function qr_check(reply: FastifyReply, query: Record<string, any>) {
  const result = await login_qr_check({ key: query.key, randomCNIP: true })
  console.log(result.body)
  if (result) {
    const body = result.body as any
    reply.status(200)
    return JSON.stringify({ code: body.code, cookie: body.cookie })
  }
  reply.status(500)
  return ''
}

export async function user_inf(reply: FastifyReply, query: Record<string, any>) {
  const result = await user_account({ cookie: query.cookie, randomCNIP: true })
  const body = result.body as any
  if (body.profile) {
    reply.status(200)
    return JSON.stringify({
      userid: body.profile.userId,
      nickname: body.profile.nickname,
      avatarUrl: body.profile.avatarUrl,
      backgroundUrl: body.profile.backgroundUrl,
      signature: body.profile.signature,
      isvip: body.account.paidFee,
      status: body.account.status,
    })
  }
  reply.status(404)
  return ''
}
