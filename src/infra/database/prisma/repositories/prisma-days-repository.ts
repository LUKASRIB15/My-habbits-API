import { DaysRepository } from "@/domain/app/application/repositories/days-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Day } from "@/domain/app/enterprise/entities/day";
import { PrismaDaysMapper } from "../mappers/prisma-days-mapper";

@Injectable()
export class PrismaDaysRepository implements DaysRepository {

  constructor(
    private prisma: PrismaService,
  ){}

  async create(day: Day): Promise<Day> {
    const data = PrismaDaysMapper.toPrisma(day)

    await this.prisma.day.create({
      data
    })

    return day
  }

  async findByDate(date: Date): Promise<Day | null> {
    const day = await this.prisma.day.findFirst({
      where: {
        date
      }
    })

    if(!day){
      return null
    }

    return PrismaDaysMapper.toDomain(day)
  }
}