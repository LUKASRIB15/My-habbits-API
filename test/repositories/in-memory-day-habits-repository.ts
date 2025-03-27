import { DayHabitsRepository } from "@/domain/app/application/repositories/day-habits-repository";
import { DayHabit } from "@/domain/app/enterprise/entities/day-habit";

export class InMemoryDayHabitsRepository implements DayHabitsRepository {
  public items: DayHabit[] = []

  async findManyByDayId(dayId: string): Promise<DayHabit[]> {
    return this.items.filter(item => item.dayId.toValue() === dayId)
  }

  async create(dayHabit: DayHabit): Promise<void> {
    this.items.push(dayHabit)
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id.toValue() !== id)
  }

  async findByDayIdAndHabitId(dayId: string, habitId: string): Promise<DayHabit | null> {
    const dayHabit = this.items.find(item => item.dayId.toValue() === dayId && item.habitId.toValue() === habitId)

    if(!dayHabit){
      return null
    }

    return dayHabit
  }
}