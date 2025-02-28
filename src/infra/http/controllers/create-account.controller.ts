import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account";
import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { Public } from "@/infra/auth/public.decorator";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

type CreateAccountBodyData = z.infer<typeof createAccountBodySchema>

@Controller('/clients/new')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(
    private createAccountUseCase: CreateAccountUseCase
  ){}

  @Public()
  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodyData){
    const {name, email, password} = body

    try{
      await this.createAccountUseCase.execute({
        name,
        email,
        password
      })
    }catch(error){
      if(error instanceof Error){
        throw new ConflictException({
          message: error.message
        })
      }
    }


  }
}