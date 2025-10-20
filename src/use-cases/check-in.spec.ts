import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    // A sigla SUT em testes de software significa System Under Test (Sistema Sob Teste).
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.154921693260626),
      longitude: new Decimal(-47.954181402800046),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 20 de janeiro de 2022

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.154921693260626,
      userLongitude: -47.954181402800046,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 20 de janeiro de 2022

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.154921693260626,
      userLongitude: -47.954181402800046,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.154921693260626,
        userLongitude: -47.954181402800046,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 20 de janeiro de 2022

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.154921693260626,
      userLongitude: -47.954181402800046,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0)) // 20 de janeiro de 2022

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.154921693260626,
      userLongitude: -47.954181402800046,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 20 de janeiro de 2022

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.124280373336145),
      longitude: new Decimal(-47.96370520395591),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.154921693260626,
        userLongitude: -47.954181402800046,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
