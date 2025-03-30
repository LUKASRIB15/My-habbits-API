import { ApiProperty } from "@nestjs/swagger";

export class ToggleHabitDTO {
  @ApiProperty({example: "d8867ad5-2ee1-4d3d-a07e-88206c819081"})
  id: string
}