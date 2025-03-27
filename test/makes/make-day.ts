import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Day, DayProps } from "@/domain/app/enterprise/entities/day";

export function makeDay(override: Partial<DayProps> = {}, id?: UniqueEntityID){
  return Day.create({
    date: new Date(new Date().setHours(0, 0, 0, 0)),
    ...override
  }, id)
}