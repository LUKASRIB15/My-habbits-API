import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export type HabitWeekDaysProps = {
  weekDay: number
  habitId: UniqueEntityID
}

export class HabitWeekDays extends Entity<HabitWeekDaysProps>{
  get weekDay(){
    return this.props.weekDay
  }

  get habitId(){
    return this.props.habitId
  }

  static create(props: HabitWeekDaysProps, id?: UniqueEntityID) {
    return new HabitWeekDays(props, id)
  }
}