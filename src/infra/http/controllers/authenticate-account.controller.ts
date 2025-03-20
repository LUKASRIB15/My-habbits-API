import { AuthenticateAccountUseCase } from "@/domain/app/application/use-cases/authenticate-account";
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { Public } from "@/infra/auth/public.decorator";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticateAccount200, AuthenticateAccount401 } from "../docs/responses/authenticate-account";
import { AuthenticateAccountDTO } from "../docs/dtos/authenticate-account.dto";
import { UnauthorizedError } from "@/core/errors/generic/unauthorized-error";

const authenticateAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// type AuthenticateAccountBodyData = z.infer<typeof authenticateAccountBodySchema>

@Controller("/clients/auth")
@ApiTags("Clients")
@UsePipes(new ZodValidationPipe(authenticateAccountBodySchema))
export class AuthenticateAccountController {
  constructor(
    private authenticateAccountUseCase: AuthenticateAccountUseCase
  ){}

  @Public()
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: "Authenticate account of client with credentials",
    description: "In this route you can authenticate a client with credentials email and password."
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: AuthenticateAccount200
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    type: AuthenticateAccount401
  })
  async handle(@Body() body: AuthenticateAccountDTO){
    const {email, password} = body

    const result = await this.authenticateAccountUseCase.execute({
      email,
      password
    })

    if(result.isFailure()){
      const error = result.value

      switch(error.constructor){
        case UnauthorizedError:
          throw new UnauthorizedException({
            message: error.message
          })
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      access_token: result.value.accessToken
    }
  }
}