import { DayHabit } from "../../enterprise/entities/day-habit";

export abstract class DayHabitsRepository {
  abstract findManyByDayId(dayId: string): Promise<DayHabit[]>
  abstract findByDayIdAndHabitId(dayId: string, habitId: string): Promise<DayHabit | null>
  abstract create(dayHabit: DayHabit): Promise<void>
  abstract delete(id: string): Promise<void>
}