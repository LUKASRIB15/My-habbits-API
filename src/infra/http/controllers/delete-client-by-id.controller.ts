import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { DeleteClientByIdUseCase } from "@/domain/app/application/use-cases/delete-client-by-id";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { BadRequestException, Controller, Delete, HttpCode, NotFoundException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DeleteClientById404 } from "../docs/responses/delete-client-by-id";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";

@Controller('/clients/me/delete')
@ApiTags('Clients')
@ApiBearerAuth()
export class DeleteClientByIdController {

  constructor(
    private deleteClientByIdUseCase: DeleteClientByIdUseCase
  ){}

  @Delete()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a client with your id (PRIVATE ROUTE)',
    description: "In this route, you can delete a client using your id inside the token"
  })
  @ApiResponse({
    status: 204,
    description: 'No Content'
  })
  @ApiResponse({
    status: 404,
    description: 'Resource Not Found Error',
    type: DeleteClientById404
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
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