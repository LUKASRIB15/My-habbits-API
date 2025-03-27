import { HabitsRepository } from "@/domain/app/application/repositories/habits-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Habit } from "@/domain/app/enterprise/entities/habit";
import { PrismaHabitsMapper } from "../mappers/prisma-habits-mapper";
import { HabitWeekDaysRepository } from "@/domain/app/application/repositories/habit-week-days-repository";
import { DateParams } from "@/core/params/date-params";

@Injectable()
export class PrismaHabitsRepository implements HabitsRepository {
  constructor(
    private prisma: PrismaService,
    private habitWeekDaysRepository: HabitWeekDaysRepository
  ){}

  async create(habit: Habit): Promise<void> {
    const data = PrismaHabitsMapper.toPrisma(habit)

    await this.prisma.habit.create({
      data
    })

    await this.habitWeekDaysRepository.createMany(
      habit.weekDays.getItems()
    )
  }

  async findManyByClientId(clientId: string, { date, weekDays }: DateParams): Promise<Habit[]> {
    const habits = await this.prisma.habit.findMany({
      where: {
        clientId,
        createdAt: {
          lte: date,
        },
        weekDays: {
          some: {
            weekDay: {
              in: weekDays
            }
          }
        }
      }
    })


    return habits.map(habit => PrismaHabitsMapper.toDomain(habit))
  }

  async findById(id: string): Promise<Habit | null> {
    const habit = await this.prisma.habit.findUnique({
      where: {
        id
      }
    })

    if(!habit){
      return null
    }

    return PrismaHabitsMapper.toDomain(habit)
  }
}