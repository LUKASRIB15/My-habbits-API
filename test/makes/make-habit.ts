import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Habit, HabitProps } from "@/domain/app/enterprise/entities/habit";
import { HabitWeekDaysList } from "@/domain/app/enterprise/entities/habit-week-days-list";
import { faker } from "@faker-js/faker";

export function makeHabit(override: Partial<HabitProps> = {}, id?: UniqueEntityID){
  return Habit.create({
    title: faker.lorem.word(),
    weekDays: new HabitWeekDaysList(),
    clientId: new UniqueEntityID(),
    ...override
  }, id)
}