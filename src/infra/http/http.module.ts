import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateAccountController } from "./controllers/authenticate-account.controller";
import { AuthenticateAccountUseCase } from "@/domain/register/application/use-cases/authenticate-account";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateAccountController
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountUseCase
  ]
})
export class HttpModule {}