import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ClientsRepository } from "@/domain/app/application/repositories/clients-repository";
import { PrismaClientsRepository } from "./prisma/repositories/prisma-clients-repository";
import { HabitWeekDaysRepository } from "@/domain/app/application/repositories/habit-week-days-repository";
import { PrismaHabitWeekDaysRepository } from "./prisma/repositories/prisma-habit-week-days-repository";
import { HabitsRepository } from "@/domain/app/application/repositories/habits-repository";
import { PrismaHabitsRepository } from "./prisma/repositories/prisma-habits-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository
    },
    {
      provide: HabitWeekDaysRepository,
      useClass: PrismaHabitWeekDaysRepository
    },
    {
      provide: HabitsRepository,
      useClass: PrismaHabitsRepository
    }
  ],
  exports: [
    PrismaService,
    ClientsRepository,
    HabitWeekDaysRepository,
    HabitsRepository
  ]
})
export class DatabaseModule {}