import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { Public } from "@/infra/auth/public.decorator";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateAccountDTO } from "../docs/dtos/create-account.dto";
import { CreateAccount409 } from "../docs/responses/create-account";
import { ConflictError } from "@/core/errors/generic/conflict-error";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

// type CreateAccountBodyData = z.infer<typeof createAccountBodySchema>

@Controller('/clients/new')
@ApiTags('Clients')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(
    private createAccountUseCase: CreateAccountUseCase
  ){}

  @Public()
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: "Create account of client with credentials",
    description: "In this route you can create an account of client with credentials as name, email and password."
  })
  @ApiResponse({
    status: 201,
    description: "Created",
  })
  @ApiResponse({
    status: 409,
    description: "Conflict Error",
    type: CreateAccount409
  })
  async handle(@Body() body: CreateAccountDTO){
    const {name, email, password} = body

    const result = await this.createAccountUseCase.execute({
      name,
      email,
      password
    })

    if(result.isFailure()){
      const error = result.value

      switch(error.constructor){
        case ConflictError:
          throw new ConflictException({
            message: error.message
          })
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}