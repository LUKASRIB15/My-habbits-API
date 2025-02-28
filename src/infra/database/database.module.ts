import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ClientsRepository } from "@/domain/register/application/repositories/clients-repository";
import { PrismaClientsRepository } from "./prisma/repositories/prisma-clients-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository
    }
  ],
  exports: [
    PrismaService,
    ClientsRepository
  ]
})
export class DatabaseModule {}