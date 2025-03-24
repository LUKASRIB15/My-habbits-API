import { Either, success } from "@/core/errors/either"
import { Habit } from "../../enterprise/entities/habit"
import { HabitsRepository } from "../repositories/habits-repository"
import { Injectable } from "@nestjs/common"

type FetchHabitsByDayUseCaseRequest = {
  date: Date
  clientId: string
}

type FetchHabitsByDayUseCaseResponse = Either<null,{
  habits: Habit[]
}>

@Injectable()
export class FetchHabitsByDayUseCase {
  
  constructor(
    private habitsRepository: HabitsRepository
  ){}

  async execute({date, clientId}: FetchHabitsByDayUseCaseRequest): Promise<FetchHabitsByDayUseCaseResponse>{
    const weekDay = date.getDay()

    const habits = await this.habitsRepository.findManyByClientId(clientId, {
      date: new Date(date.setHours(0, 0, 0, 0)),
      weekDays: [weekDay]
    })

    return success({
      habits,
    })
  }
}