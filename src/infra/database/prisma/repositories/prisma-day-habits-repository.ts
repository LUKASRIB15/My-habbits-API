import { DayHabitsRepository } from "@/domain/app/application/repositories/day-habits-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { DayHabit } from "@/domain/app/enterprise/entities/day-habit";
import { PrismaDayHabitsMapper } from "../mappers/prisma-day-habits-mapper";

@Injectable()
export class PrismaDayHabitsRepository implements DayHabitsRepository {

  constructor(
    private prisma: PrismaService
  ){}

  async create(dayHabit: DayHabit): Promise<void> {
    const data = PrismaDayHabitsMapper.toPrisma(dayHabit)

    await this.prisma.dayHabit.create({
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.dayHabit.delete({
      where:{
        id
      }
    })
  }

  async findManyByDayId(dayId: string): Promise<DayHabit[]> {
    const dayHabits = await this.prisma.dayHabit.findMany({
      where: {
        dayId
      }
    })

    return dayHabits.map(dayHabit => PrismaDayHabitsMapper.toDomain(dayHabit))
  }

  async findByDayIdAndHabitId(dayId: string, habitId: string): Promise<DayHabit | null> {
    const dayHabit = await this.prisma.dayHabit.findFirst({
      where: {
        dayId,
        habitId
      }
    })

    if(!dayHabit){
      return null
    }

    return PrismaDayHabitsMapper.toDomain(dayHabit)
  }
}