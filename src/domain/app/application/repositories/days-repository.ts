import { Day } from "../../enterprise/entities/day";

export abstract class DaysRepository {
  abstract findByDate(date: Date): Promise<Day | null>
  abstract create(day: Day): Promise<Day>
}