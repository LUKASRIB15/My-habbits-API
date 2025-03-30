import { ApiProperty } from "@nestjs/swagger";

export class ToggleHabit403 {
  @ApiProperty({example: "This habit does not belong to you."})
  message: string
}