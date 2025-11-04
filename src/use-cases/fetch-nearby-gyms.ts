import type { GymsRepository } from '@/repositories/gyms-repository'
import type { Gym } from '@prisma/client'

interface FetchNearbyGymsUserCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUserCaseResponse {
  gyms: Gym[]
} 

export class FetchNearbyGymsUserCase {
  constructor(private gymsRepository: GymsRepository) {}
    
  async execute({
    userLongitude,
    userLatitude,
  }: FetchNearbyGymsUserCaseRequest): Promise<FetchNearbyGymsUserCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      }
    )

    return { 
      gyms,
    }
  }
}