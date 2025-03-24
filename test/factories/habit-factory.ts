import { HabitProps } from "@/domain/app/enterprise/entities/habit";
import { PrismaHabitWeekDaysMapper } from "@/infra/database/prisma/mappers/prisma-habit-week-days-mapper";
import { PrismaHabitsMapper } from "@/infra/database/prisma/mappers/prisma-habits-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { makeHabit } from "test/makes/make-habit";

@Injectable()
export class HabitFactory {
  constructor(
    private prisma: PrismaService
  ){}

  async makePrismaHabit(data: Partial<HabitProps> = {}){
    const habit = makeHabit(data)

    await this.prisma.habit.create({
      data: PrismaHabitsMapper.toPrisma(habit)
    })

    await this.prisma.habitWeekDays.createMany(
      PrismaHabitWeekDaysMapper.toPrismaCreateMany(habit.weekDays.getItems())
    )

    return habit
  }
}