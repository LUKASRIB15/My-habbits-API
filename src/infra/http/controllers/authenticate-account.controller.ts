import { AuthenticateAccountUseCase } from "@/domain/register/application/use-cases/authenticate-account";
import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { Public } from "@/infra/auth/public.decorator";

const authenticateAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

type AuthenticateAccountBodyData = z.infer<typeof authenticateAccountBodySchema>

@Controller("/clients/auth")
@UsePipes(new ZodValidationPipe(authenticateAccountBodySchema))
export class AuthenticateAccountController {
  constructor(
    private authenticateAccountUseCase: AuthenticateAccountUseCase
  ){}

  @Public()
  @Post()
  @HttpCode(200)
  async handle(@Body() body: AuthenticateAccountBodyData){
    const {email, password} = body

    try{
      const {accessToken} = await this.authenticateAccountUseCase.execute({
        email,
        password
      })

      return {
        access_token: accessToken,
      }
    }catch(error){
      if(error instanceof Error){
        throw new UnauthorizedException(error.message)
      }
    }
  }
}