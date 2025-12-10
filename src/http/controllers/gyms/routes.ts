import type { FastifyInstance } from 'fastify'

import { VerifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', VerifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}
