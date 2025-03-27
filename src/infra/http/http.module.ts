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
import { CreateHabitController } from "./controllers/create-habit.controller";
import { CreateHabitUseCase } from "@/domain/app/application/use-cases/create-habit";
import { FetchHabitsByDayController } from "./controllers/fetch-habits-by-day.controller";
import { FetchHabitsByDayUseCase } from "@/domain/app/application/use-cases/fetch-habits-by-day";
import { ToggleHabitController } from "./controllers/toggle-habit.controller";
import { ToggleHabitUseCase } from "@/domain/app/application/use-cases/toggle-habit";

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
    DeleteClientByIdController,
    CreateHabitController,
    FetchHabitsByDayController,
    ToggleHabitController
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateAccountUseCase,
    GetClientByIdUseCase,
    EditClientUseCase,
    DeleteClientByIdUseCase,
    CreateHabitUseCase,
    FetchHabitsByDayUseCase,
    ToggleHabitUseCase
  ]
})
export class HttpModule {}