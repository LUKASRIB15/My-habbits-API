import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { FetchHabitsByDayUseCase } from "@/domain/app/application/use-cases/fetch-habits-by-day";
import { HabitsPresenter } from "../presenters/habits-presenter";
import { DayHabitsPresenter } from "../presenters/day-habits-presenter";

const fetchHabitsByDayQuerySchema = z.object({
  date: z.coerce.date().optional().default(new Date())
})

type FetchHabitsByDayQueryData = z.infer<typeof fetchHabitsByDayQuerySchema>

const fetchHabitsByDayValidationPipe = new ZodValidationPipe(fetchHabitsByDayQuerySchema)

@Controller('/habits/day')
export class FetchHabitsByDayController {

  constructor(
    private fetchHabitsByDayUseCase: FetchHabitsByDayUseCase
  ){}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchHabitsByDayValidationPipe) query: FetchHabitsByDayQueryData
  ){  

    const { date } = query

    const clientId = user.sub

    const result = await this.fetchHabitsByDayUseCase.execute({
      date,
      clientId
    })

    if(result.isFailure()){
      throw new BadRequestException()
    }

    return {
      possibleHabits: result.value.possibleHabits.map(habit => HabitsPresenter.toHTTP(habit)),
      completedHabitIds: result.value.completedHabits.map(dayHabit => DayHabitsPresenter.toHTTP(dayHabit))
    }
  }
}