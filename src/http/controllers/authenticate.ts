import type { FastifyRequest, FastifyReply } from 'fastify'
import z from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)
    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }
    // return reply.status(500).send() // TODO: fix me
    throw error
  }

  return reply.status(200).send()
}
