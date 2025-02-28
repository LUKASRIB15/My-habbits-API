import { ApiProperty } from "@nestjs/swagger";

export class CreateAccount409 {
  @ApiProperty({example: "Client already exists."})
  message: string
}