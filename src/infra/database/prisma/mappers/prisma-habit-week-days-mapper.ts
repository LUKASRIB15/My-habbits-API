import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { HabitWeekDays } from "@/domain/app/enterprise/entities/habit-week-days";
import { Prisma } from "@prisma/client";

export class PrismaHabitWeekDaysMapper {
  static toDomain(raw: Prisma.HabitWeekDaysUncheckedCreateInput): HabitWeekDays{
    return HabitWeekDays.create({
      habitId: new UniqueEntityID(raw.habitId),
      weekDay: raw.weekDay,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(habitWeekDay: HabitWeekDays): Prisma.HabitWeekDaysUncheckedCreateInput {
    return {
      id: habitWeekDay.id.toValue(),
      weekDay: habitWeekDay.weekDay,
      habitId: habitWeekDay.habitId.toValue(),
    }
  }

  static toPrismaCreateMany(habitWeekDays: HabitWeekDays[]): Prisma.HabitWeekDaysCreateManyArgs {

    return {
      data: habitWeekDays.map(habitWeekDay => PrismaHabitWeekDaysMapper.toPrisma(habitWeekDay)),
    }
  }
}