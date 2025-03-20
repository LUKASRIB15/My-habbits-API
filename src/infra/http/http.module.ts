import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateAccountUseCase } from "@/domain/app/application/use-cases/create-account";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AuthenticateAccountController } from "./controllers/authenticate-account.controller";
import { AuthenticateAccountUseCase } from "@/domain/app/application/use-cases/authenticate-account";
import { GetClientByIdController } from "./controllers/get-client-by-id.controller";
import { GetClientByIdUseCase } from "@/domain/app/application/use-cases/get-client-by-id";
import { EditClientController } from "./controllers/edit-client.controller";
import { EditClientUseCase } from "@/domain/app/application/use-cases/edit-client";
import { DeleteClientByIdController } from "./controllers/delete-client-by-id.controller";
import { DeleteClientByIdUseCase } from "@/domain/app/application/use-cases/delete-client-by-id";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule
  ],
  controllers: [
    CreateAccountController,
    AuthenticateAccountController,
    GetClientByIdController,
    EditClientController,
    DeleteClientByIdController
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountUseCase,
    GetClientByIdUseCase,
    EditClientUseCase,
    DeleteClientByIdUseCase
  ]
})
export class HttpModule {}