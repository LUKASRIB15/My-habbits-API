import { HabitWeekDaysRepository } from "@/domain/app/application/repositories/habit-week-days-repository";
import { HabitWeekDays } from "@/domain/app/enterprise/entities/habit-week-days";

export class InMemoryHabitWeekDaysRepository implements HabitWeekDaysRepository {
  public items: HabitWeekDays[] = []

  async createMany(habitWeekDays: HabitWeekDays[]): Promise<void> {
    this.items.push(...habitWeekDays)
  }

  async findManyByHabitIdsAndWeekDays(habitIds: string[], weekDays: number[]): Promise<string[]> {
    const habitsWeekDays = this.items
      .filter(item => habitIds.includes(item.habitId.toValue()) && weekDays.includes(item.weekDay))
  
    const habitsOfDayIds = habitsWeekDays.map(habit => habit.habitId.toValue())

    return habitsOfDayIds
  }
}