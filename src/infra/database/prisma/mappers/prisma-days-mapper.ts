import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Day } from "@/domain/app/enterprise/entities/day";
import { Prisma } from "@prisma/client";

export class PrismaDaysMapper {
  static toDomain(raw: Prisma.DayUncheckedCreateInput): Day {
    return Day.create({
      date: new Date(raw.date)
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(day: Day): Prisma.DayUncheckedCreateInput {
    return {
      id: day.id.toValue(),
      date: day.date
    }
  }
}