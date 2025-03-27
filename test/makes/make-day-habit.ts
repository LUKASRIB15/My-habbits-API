import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DayHabit, DayHabitProps } from "@/domain/app/enterprise/entities/day-habit";

export function makeDayHabit(override: Partial<DayHabitProps> = {}, id?: UniqueEntityID){
  return DayHabit.create({
    habitId: new UniqueEntityID(),
    dayId: new UniqueEntityID(),
    ...override
  }, id)
}