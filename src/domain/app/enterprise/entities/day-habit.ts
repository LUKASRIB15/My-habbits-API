import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export type DayHabitProps = {
  habitId: UniqueEntityID,
  dayId: UniqueEntityID
}

export class DayHabit extends Entity<DayHabitProps>{

  get habitId(){
    return this.props.habitId
  }

  get dayId(){
    return this.props.dayId
  }

  static create(props: DayHabitProps, id?: UniqueEntityID){
    return new DayHabit(props, id)
  }
}