import { ApiProperty } from "@nestjs/swagger";

export class CreateHabit400 {
  @ApiProperty({example: "'A habit needs at least one week day.'"})
  message: string
}