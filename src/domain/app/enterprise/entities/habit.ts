import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { HabitWeekDaysList } from "./habit-week-days-list"

export type HabitProps = {
  title: string
  weekDays: HabitWeekDaysList
  clientId: UniqueEntityID
  createdAt: Date
}

export class Habit extends Entity<HabitProps> {

  get title(){
    return this.props.title
  }

  get weekDays(){
    return this.props.weekDays
  }

  set weekDays(value: HabitWeekDaysList){
    this.props.weekDays = value
  }

  get clientId(){
    return this.props.clientId
  }

  get createdAt(){
    return this.props.createdAt
  }

  static create(props: Optional<HabitProps,  'createdAt' | 'weekDays'>, id?: UniqueEntityID){
    return new Habit({
      ...props,
      weekDays: props.weekDays ?? new HabitWeekDaysList(),
      createdAt: props.createdAt ?? new Date(new Date().setHours(0, 0, 0, 0))
    }, id)
  }
}