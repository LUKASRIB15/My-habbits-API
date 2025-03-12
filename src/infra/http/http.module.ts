import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateAccountUseCase } from "@/domain/register/application/use-cases/create-account";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateAccountController } from "./controllers/authenticate-account.controller";
import { AuthenticateAccountUseCase } from "@/domain/register/application/use-cases/authenticate-account";
import { GetClientByIdController } from "./controllers/get-client-by-id.controller";
import { GetClientByIdUseCase } from "@/domain/register/application/use-cases/get-client-by-id";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateAccountController,
    GetClientByIdController
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountUseCase,
    GetClientByIdUseCase
  ]
})
export class HttpModule {}