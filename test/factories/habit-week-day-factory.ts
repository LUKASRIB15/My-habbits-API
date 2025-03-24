import { HabitWeekDaysProps } from "@/domain/app/enterprise/entities/habit-week-days";
import { PrismaHabitWeekDaysMapper } from "@/infra/database/prisma/mappers/prisma-habit-week-days-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { makeHabitWeekDay } from "test/makes/make-habit-week-day";

@Injectable()
export class HabitWeekDayFactory {
  constructor(
    private prisma: PrismaService
  ){}

  async makePrismaHabitWeekDay(data: Partial<HabitWeekDaysProps> = {}){
    const habitWeekDay = makeHabitWeekDay(data)

    await this.prisma.habitWeekDays.create({
      data: PrismaHabitWeekDaysMapper.toPrisma(habitWeekDay)
    })

    return habitWeekDay
  }
}