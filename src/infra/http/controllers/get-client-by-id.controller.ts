import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { GetClientByIdUseCase } from "@/domain/register/application/use-cases/get-client-by-id";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { BadRequestException, Controller, Get, HttpCode, NotFoundException } from "@nestjs/common";
import { ClientsPresenter } from "../presenters/clients-presenter";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetClientById200, GetClientById404 } from "../docs/responses/get-client-by-id";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";

@Controller('/clients/me')
@ApiTags("Clients")
@ApiBearerAuth()
export class GetClientByIdController {
  constructor(
    private getClientByIdUseCase: GetClientByIdUseCase
  ){}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: "Get data about the user logged in application (PRIVATE ROUTE)",
    description: "Fetches data about a client using their ID within the access token"
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: GetClientById200
  })
  @ApiResponse({
    status: 404,
    description: "Resource Not Found Error",
    type: GetClientById404
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
  async handle(@CurrentUser() user: UserPayload){
    const currentUserId = user.sub

    const result = await this.getClientByIdUseCase.execute({
      id: currentUserId
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

    return ClientsPresenter.toHTTP(result.value.client)

  }
}