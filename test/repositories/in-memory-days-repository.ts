import { DaysRepository } from "@/domain/app/application/repositories/days-repository";
import { Day } from "@/domain/app/enterprise/entities/day";

export class InMemoryDaysRepository implements DaysRepository {
  public items: Day[] = []

  async findByDate(date: Date): Promise<Day | null> {

    const day = this.items.find(day => day.date.toISOString() === date.toISOString())
  
    if(!day){
      return null
    }

    return day
  }

  async create(day: Day): Promise<Day> {
    this.items.push(day)

    return day
  }
}