import { FastifyInstance } from 'fastify'
import * as authService from '../services/auth.service'

export default async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/auth/qr', async (request, reply) => {
    const data = request.body as Record<string, any>
    console.log(data)
    return authService.generate_qr_code(reply, data)
  })

  app.post('/api/auth/qr/check', async (request, reply) => {
    const data = request.body as Record<string, any>
    return authService.qr_check(reply, data)
  })

  app.post('/api/auth/user', async (request, reply) => {
    const data = request.body as Record<string, any>
    return authService.user_inf(reply, data)
  })
}
