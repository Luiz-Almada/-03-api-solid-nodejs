// Factory Pattern
import { AuthenticateUseCase } from '../authenticate'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
