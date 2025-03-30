import { BadRequestException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { FetchHabitsByDayUseCase } from "@/domain/app/application/use-cases/fetch-habits-by-day";
import { HabitsPresenter } from "../presenters/habits-presenter";
import { DayHabitsPresenter } from "../presenters/day-habits-presenter";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FetchHabitsByDayDTO } from "../docs/dtos/fetch-habits-by-day.dto";
import { FetchHabitByDay200 } from "../docs/responses/fetch-habits-by-day";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";

const fetchHabitsByDayQuerySchema = z.object({
  date: z.coerce.date().optional().default(new Date())
})

// type FetchHabitsByDayQueryData = z.infer<typeof fetchHabitsByDayQuerySchema>

const fetchHabitsByDayValidationPipe = new ZodValidationPipe(fetchHabitsByDayQuerySchema)

@Controller('/habits/day')
@ApiTags('Habits')
@ApiBearerAuth()
export class FetchHabitsByDayController {

  constructor(
    private fetchHabitsByDayUseCase: FetchHabitsByDayUseCase
  ){}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch habits by a day (PRIVATE ROUTE)',
    description: "This route is used to fetch habits by a day. It returns a list of habits and a list of completed habit ids."
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: FetchHabitByDay200
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(fetchHabitsByDayValidationPipe) query: FetchHabitsByDayDTO
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