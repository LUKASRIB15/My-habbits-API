import { CreateHabitUseCase } from "@/domain/app/application/use-cases/create-habit";
import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { WeekDaysIsEmptyError } from "@/domain/app/application/use-cases/errors/week-days-is-empty-error";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateHabitDTO } from "../docs/dtos/create-habit.dto";
import { CreateHabit400 } from "../docs/responses/create-habit";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";

const createHabitBodySchema = z.object({
  title: z.string(),
  weekDays: z.array(z.number())
})

// type CreateHabitBodyData = z.infer<typeof createHabitBodySchema>

const createHabitValidationPipe = new ZodValidationPipe(createHabitBodySchema)

@Controller('/habits/new')
@ApiTags('Habits')
@ApiBearerAuth()
export class CreateHabitController {
  
  constructor(
    private createHabitUseCase: CreateHabitUseCase
  ){}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: "Create a new habit (PRIVATE ROUTE)",
    description: "In this route, you can create a new habit passing the title and the week days where the habit should be done. "
  })
  @ApiResponse({
    status: 201,
    description: "Created",
  })
  @ApiResponse({
    status: 400,
    description: "Week Days Is Empty Error",
    type: CreateHabit400
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createHabitValidationPipe) body: CreateHabitDTO
  ){
    const {title, weekDays} = body

    const clientId = user.sub

    const result = await this.createHabitUseCase.execute({
      title,
      weekDays,
      clientId,
    })

    if(result.isFailure()){
      const error = result.value

      switch(error.constructor){
        case WeekDaysIsEmptyError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}