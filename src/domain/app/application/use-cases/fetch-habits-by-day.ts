import { Either, success } from "@/core/errors/either"
import { Habit } from "../../enterprise/entities/habit"
import { HabitsRepository } from "../repositories/habits-repository"
import { Injectable } from "@nestjs/common"
import { DaysRepository } from "../repositories/days-repository"
import { DayHabitsRepository } from "../repositories/day-habits-repository"
import { DayHabit } from "../../enterprise/entities/day-habit"

type FetchHabitsByDayUseCaseRequest = {
  date: Date
  clientId: string
}

type FetchHabitsByDayUseCaseResponse = Either<null,{
  possibleHabits: Habit[],
  completedHabits: DayHabit[]
}>

@Injectable()
export class FetchHabitsByDayUseCase {
  
  constructor(
    private habitsRepository: HabitsRepository,
    private daysRepository: DaysRepository,
    private dayHabitsRepository: DayHabitsRepository
  ){}

  async execute({date, clientId}: FetchHabitsByDayUseCaseRequest): Promise<FetchHabitsByDayUseCaseResponse>{
    const weekDay = date.getDay()

    const habitsOfDay = await this.habitsRepository.findManyByClientId(clientId, {
      date: new Date(date.setHours(0, 0, 0, 0)),
      weekDays: [weekDay]
    })

    const day = await this.daysRepository.findByDate(new Date(date.setHours(0,0,0,0)))

    const habitsMade = day ? await this.dayHabitsRepository.findManyByDayId(day.id.toValue()) : []

    return success({
      possibleHabits: habitsOfDay,
      completedHabits: habitsMade
    })
  }
}