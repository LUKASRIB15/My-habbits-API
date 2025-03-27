import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export type DayProps = {
  date: Date
}

export class Day extends Entity<DayProps>{
  get date(){
    return this.props.date
  }

  static create(props: Optional<DayProps, 'date'>, id?: UniqueEntityID){
    return new Day({
      date: props.date ?? new Date(new Date().setHours(0, 0, 0, 0)),
    }, id)
  }
}