import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { DeleteClientByIdUseCase } from "@/domain/app/application/use-cases/delete-client-by-id";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { BadRequestException, Controller, Delete, HttpCode, NotFoundException } from "@nestjs/common";

@Controller('/clients/me/delete')
export class DeleteClientByIdController {

  constructor(
    private deleteClientByIdUseCase: DeleteClientByIdUseCase
  ){}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload
  ){
    const clientId = user.sub

    const result = await this.deleteClientByIdUseCase.execute({
      id: clientId
    })

    if(result.isFailure()){
      const error = result.value

      switch(error.constructor){
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}