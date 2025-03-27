import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { BadRequestException, Controller, ForbiddenException, HttpCode, NotFoundException, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { ToggleHabitUseCase } from "@/domain/app/application/use-cases/toggle-habit";
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { NoPermissionError } from "@/core/errors/generic/no-permission-error";

const toggleHabitParamsSchema = z.object({
  id: z.string().uuid()
})

type ToggleHabitParamsData = z.infer<typeof toggleHabitParamsSchema>

const toggleHabitValidationPipe = new ZodValidationPipe(toggleHabitParamsSchema)

@Controller('/habits/:id/toggle')
export class ToggleHabitController {
  constructor(
    private toggleHabitUseCase: ToggleHabitUseCase
  ){}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(toggleHabitValidationPipe) params: ToggleHabitParamsData
  ){
    const { id } = params

    const clientId = user.sub

    const result = await this.toggleHabitUseCase.execute({
      habitId: id,
      clientId, 
    })

    if(result.isFailure()){
      const error = result.value

      switch(error.constructor){
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NoPermissionError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}