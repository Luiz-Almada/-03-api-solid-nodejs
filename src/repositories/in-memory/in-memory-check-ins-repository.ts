import dayjs from 'dayjs';
import type { CheckIn, Prisma } from '@prisma/client';
import type { CheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];  
  
  async findById(id: string) {
    const checkIn = this.items.find((item) => item.id === id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    
    // retorna o início do dia. Exemplo: 20 de janeiro de 2022 00:00:00
    const startOfTheDay = dayjs(date).startOf('date');
    
    // retorna o fim do dia. Exemplo: 20 de janeiro de 2022 23:59:59
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate;
    } );

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
    .filter((item) => item.user_id === userId)
    .slice((page - 1) * 20, page * 20)
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }  
}