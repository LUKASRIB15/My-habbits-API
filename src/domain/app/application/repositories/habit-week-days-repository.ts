import { HabitWeekDays } from "../../enterprise/entities/habit-week-days";

export abstract class HabitWeekDaysRepository {
  abstract createMany(habitWeekDays: HabitWeekDays[]): Promise<void>
  abstract findManyByHabitIdsAndWeekDays(habitIds: string[], weekDays: number[]): Promise<string[]>
}