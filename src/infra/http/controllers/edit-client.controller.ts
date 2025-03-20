import { BadRequestException, Body, Controller, HttpCode, NotFoundException, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { EditClientUseCase } from "@/domain/app/application/use-cases/edit-client";
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";
import { ClientsPresenter } from "../presenters/clients-presenter";

const editClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
}) 

type EditClientBodyData = z.infer<typeof editClientBodySchema>

const editClientValidationPipe = new ZodValidationPipe(editClientBodySchema)

@Controller('/clients/me/edit')
export class EditClientController {
  
  constructor(
    private editClientUseCase: EditClientUseCase
  ){}

  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(editClientValidationPipe) body: EditClientBodyData
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