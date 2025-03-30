import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { BadRequestException, Controller, ForbiddenException, HttpCode, NotFoundException, Param, Patch } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { ToggleHabitUseCase } from "@/domain/app/application/use-cases/toggle-habit";
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { NoPermissionError } from "@/core/errors/generic/no-permission-error";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ToggleHabitDTO } from "../docs/dtos/toggle-habit.dto";
import { ToggleHabit403 } from "../docs/responses/toggle-habit";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";

const toggleHabitParamsSchema = z.object({
  id: z.string().uuid()
})

// type ToggleHabitParamsData = z.infer<typeof toggleHabitParamsSchema>

const toggleHabitValidationPipe = new ZodValidationPipe(toggleHabitParamsSchema)

@Controller('/habits/:id/toggle')
@ApiTags('Habits')
@ApiBearerAuth()
export class ToggleHabitController {
  constructor(
    private toggleHabitUseCase: ToggleHabitUseCase
  ){}

  @Patch()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Toggle a habit as done or not done (PRIVATE ROUTE)',
    description: 'This endpoint allows you to toggle a habit as done or not done with id parameter.'
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 403,
    description: 'No Permission Error',
    type: ToggleHabit403
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(toggleHabitValidationPipe) params: ToggleHabitDTO
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