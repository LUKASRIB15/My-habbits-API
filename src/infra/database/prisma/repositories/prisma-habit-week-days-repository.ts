import { HabitWeekDaysRepository } from "@/domain/app/application/repositories/habit-week-days-repository";
import { PrismaService } from "../prisma.service";
import { HabitWeekDays } from "@/domain/app/enterprise/entities/habit-week-days";
import { PrismaHabitWeekDaysMapper } from "../mappers/prisma-habit-week-days-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaHabitWeekDaysRepository implements HabitWeekDaysRepository {

  constructor(
    private prisma: PrismaService
  ){}

  async createMany(habitWeekDays: HabitWeekDays[]): Promise<void> {
    
    await this.prisma.habitWeekDays.createMany(
      PrismaHabitWeekDaysMapper.toPrismaCreateMany(habitWeekDays)
    )
  }

  async findManyByHabitIdsAndWeekDays(habitIds: string[], weekDays: number[]): Promise<string[]> {
    const habitsWeekDays = await this.prisma.habitWeekDays.findMany({
      where: {
        habitId: {
          in: habitIds
        },
        weekDay: {
          in: weekDays
        }
      }
    })

    const habitsOfDayIds = habitsWeekDays.map(habit => habit.habitId) 

    return habitsOfDayIds
  }
}