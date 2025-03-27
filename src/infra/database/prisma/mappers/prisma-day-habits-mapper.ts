import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DayHabit } from "@/domain/app/enterprise/entities/day-habit";
import { Prisma } from "@prisma/client";

export class PrismaDayHabitsMapper {
  static toDomain(raw: Prisma.DayHabitUncheckedCreateInput): DayHabit {
    return DayHabit.create({
      habitId: new UniqueEntityID(raw.habitId),
      dayId: new UniqueEntityID(raw.dayId),
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(dayHabit: DayHabit): Prisma.DayHabitUncheckedCreateInput{
    return {
      id: dayHabit.id.toValue(),
      dayId: dayHabit.dayId.toValue(),
      habitId: dayHabit.habitId.toValue(),
    }
  }
}