import { ApiProperty } from "@nestjs/swagger";

export class FetchHabitsByDayDTO {
  @ApiProperty({example: "2025-03-21T03:00:00.000"})
  date: Date
}