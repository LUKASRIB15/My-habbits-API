import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Habit } from "@/domain/app/enterprise/entities/habit";
import { Prisma } from "@prisma/client";

export class PrismaHabitsMapper {
  
  static toDomain(raw: Prisma.HabitUncheckedCreateInput): Habit{
    return Habit.create({
      title: raw.title,
      clientId: new UniqueEntityID(raw.clientId),
      createdAt: new Date(raw.createdAt),
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(habit: Habit): Prisma.HabitUncheckedCreateInput{
    return {
      id: habit.id.toValue(),
      clientId: habit.clientId.toValue(),
      title: habit.title,
      createdAt: habit.createdAt,
    }
  }
}