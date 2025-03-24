import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { HabitWeekDays, HabitWeekDaysProps } from "@/domain/app/enterprise/entities/habit-week-days";

export function makeHabitWeekDay(override: Partial<HabitWeekDaysProps> = {}, id?: UniqueEntityID){
  return HabitWeekDays.create({
    weekDay: 0,
    habitId: new UniqueEntityID(),
    ...override
  }, id)
}