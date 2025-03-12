import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedResponse {
  @ApiProperty({example: "Unauthorized."})
  message: string
}