import { CreateHabitUseCase } from "@/domain/app/application/use-cases/create-habit";
import { BadRequestException, Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { WeekDaysIsEmptyError } from "@/domain/app/application/use-cases/errors/week-days-is-empty-error";

const createHabitBodySchema = z.object({
  title: z.string(),
  weekDays: z.array(z.number())
})

type CreateHabitBodyData = z.infer<typeof createHabitBodySchema>

const createHabitValidationPipe = new ZodValidationPipe(createHabitBodySchema)

@Controller('/habits/new')
export class CreateHabitController {
  
  constructor(
    private createHabitUseCase: CreateHabitUseCase
  ){}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(createHabitValidationPipe) body: CreateHabitBodyData
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