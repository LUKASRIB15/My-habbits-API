import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DateParams } from "@/core/params/date-params";
import { HabitsRepository } from "@/domain/app/application/repositories/habits-repository";
import { Habit } from "@/domain/app/enterprise/entities/habit";
import { HabitWeekDaysRepository } from "@/domain/app/application/repositories/habit-week-days-repository";

export class InMemoryHabitsRepository implements HabitsRepository {
  public items: Habit[] = []

  constructor(
    private habitWeekDaysRepository: HabitWeekDaysRepository
  ){}

  async create(habit: Habit): Promise<void> {
    this.items.push(habit)

    this.habitWeekDaysRepository.createMany(habit.weekDays.getItems())
  }

  async findManyByClientId(clientId: string, {date, weekDays}: DateParams): Promise<Habit[]> {
  
    const clientHabits = this.items
      .filter(item => item.clientId.equals(new UniqueEntityID(clientId)))
      .filter(item => new Date(item.createdAt.setHours(0, 0, 0, 0)) <= new Date(date.setHours(0, 0, 0, 0)))
  
    const clientHabitsIds = clientHabits.map(item => item.id.toValue())

    const habitsWeekDays = await this.habitWeekDaysRepository.findManyByHabitIdsAndWeekDays(clientHabitsIds, weekDays)

    const habitsOfDay = clientHabits.filter(clientHabit => habitsWeekDays.includes(clientHabit.id.toValue()))

    return habitsOfDay
  }

  async findById(id: string): Promise<Habit | null> {
    const habit = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    if(!habit){
      return null
    }

    return habit
  }
}