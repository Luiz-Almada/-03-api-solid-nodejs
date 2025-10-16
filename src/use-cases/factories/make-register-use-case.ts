// Factory Pattern
import { RegisterUseCase } from '../register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
