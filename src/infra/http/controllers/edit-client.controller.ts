import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { EditClientUseCase } from "@/domain/app/application/use-cases/edit-client";
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { ClientsPresenter } from "../presenters/clients-presenter";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { EditClient200, EditClient404 } from "../docs/responses/edit-client";
import { UnauthorizedResponse } from "../docs/responses/generics/unauthorized";
import { EditClientDTO } from "../docs/dtos/edit-client.dto";

const editClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
}) 

// type EditClientBodyData = z.infer<typeof editClientBodySchema>

const editClientValidationPipe = new ZodValidationPipe(editClientBodySchema)

@Controller('/clients/me/edit')
@ApiTags('Clients')
@ApiBearerAuth()
export class EditClientController {
  
  constructor(
    private editClientUseCase: EditClientUseCase
  ){}

  @Put()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update data about client (PRIVATE ROUTE)',
    description: 'In this route, you can update data about client such as name, email and password.'
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: EditClient200
  })
  @ApiResponse({
    status: 404,
    description: 'Resource Not Found Error',
    type: EditClient404
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized Error",
    type: UnauthorizedResponse
  })
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(editClientValidationPipe) body: EditClientDTO
  ){
    const clientId = user.sub
    
    const {name, email, password} = body

    const result = await this.editClientUseCase.execute({
      id: clientId,
      name,
      email,
      password
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