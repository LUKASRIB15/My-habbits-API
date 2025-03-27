import { Either, failure, success } from "@/core/errors/either"
import { HabitsRepository } from "../repositories/habits-repository"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"
import { DaysRepository } from "../repositories/days-repository"
import { DayHabitsRepository } from "../repositories/day-habits-repository"
import { Day } from "../../enterprise/entities/day"
import { DayHabit } from "../../enterprise/entities/day-habit"
import { Injectable } from "@nestjs/common"
import { ClientsRepository } from "../repositories/clients-repository"
import { NoPermissionError } from "@/core/errors/generic/no-permission-error"

type ToggleHabitUseCaseRequest = {
  habitId: string,
  clientId: string
}

type ToggleHabitUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class ToggleHabitUseCase {

  constructor(
    private clientsRepository: ClientsRepository,
    private habitsRepository: HabitsRepository,
    private daysRepository: DaysRepository,
    private dayHabitsRepository: DayHabitsRepository
  ){}

  async execute({habitId, clientId}: ToggleHabitUseCaseRequest): Promise<ToggleHabitUseCaseResponse>{
    const habit = await this.habitsRepository.findById(habitId)

    if(!habit){
      return failure(new ResourceNotFoundError('Habit not found.'))
    }

    if(habit.clientId.toValue() !== clientId){
      return failure(new NoPermissionError("This habit does not belong to you."))
    }

    const today = Day.create({})

    let day = await this.daysRepository.findByDate(today.date)

    if(!day){
      day = await this.daysRepository.create(today)
    }

    const dayHabit = await this.dayHabitsRepository.findByDayIdAndHabitId(day.id.toString(), habit.id.toString())
    
    if(dayHabit){
      await this.dayHabitsRepository.delete(dayHabit.id.toString())
    }else{
      const newDayHabit = DayHabit.create({
        dayId: day.id,
        habitId: habit.id
      })
      await this.dayHabitsRepository.create(newDayHabit)
    }
    
    return success(null)
  }
}