import { ApiProperty } from "@nestjs/swagger";
import { HabitsPresenter } from "../../presenters/habits-presenter";
import { DayHabitsPresenter } from "../../presenters/day-habits-presenter";

export class FetchHabitByDay200 {
  @ApiProperty({example: [
    {
      id: "d8867ad5-2ee1-4d3d-a07e-88206c819081",
      title: "my-habit"
    }
  ]})
  possibleHabits: Array<typeof HabitsPresenter.toHTTP>

  @ApiProperty({example: [
    {
      habitId: "d8867ad5-2ee1-4d3d-a07e-88206c819081"
    }
  ]})
  completedHabitIds: Array<typeof DayHabitsPresenter.toHTTP>
}