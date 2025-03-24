import { Either, failure, success } from "@/core/errors/either"
import { Habit } from "../../enterprise/entities/habit"
import { HabitWeekDaysList } from "../../enterprise/entities/habit-week-days-list"
import { HabitWeekDays } from "../../enterprise/entities/habit-week-days"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { HabitsRepository } from "../repositories/habits-repository"
import { WeekDaysIsEmptyError } from "./errors/week-days-is-empty-error"
import { Injectable } from "@nestjs/common"

type CreateHabitUseCaseRequest = {
  title: string
  weekDays: number[]
  clientId: string
}

type CreateHabitUseCaseResponse = Either<WeekDaysIsEmptyError, null>

@Injectable()
export class CreateHabitUseCase {
  constructor(
    private habitsRepository: HabitsRepository
  ){}

  async execute({title, weekDays, clientId}: CreateHabitUseCaseRequest): Promise<CreateHabitUseCaseResponse> {
    if(weekDays.length === 0){
      return failure(new WeekDaysIsEmptyError())
    }

    const habit = Habit.create({
      title,
      clientId: new UniqueEntityID(clientId)
    })

    const habitWeekDays = weekDays.map(weekDay => {
      return HabitWeekDays.create({
        weekDay,
        habitId: habit.id
      })
    })

    habit.weekDays = new HabitWeekDaysList(habitWeekDays)

    await this.habitsRepository.create(habit)

    return success(null)
  }
}