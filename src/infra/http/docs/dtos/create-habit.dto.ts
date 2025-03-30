import { ApiProperty } from "@nestjs/swagger"

export class CreateHabitDTO{
  @ApiProperty({example: "my habit"})
  title: string

  @ApiProperty({example: [0,1,2,3,4,5,6]})
  weekDays: Array<number>
}