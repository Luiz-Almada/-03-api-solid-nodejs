// Factory Pattern
import { FetchNearbyGymsUserCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  const useCase = new FetchNearbyGymsUserCase(gymsRepository)

  return useCase
}
