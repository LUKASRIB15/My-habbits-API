import { ApiProperty } from "@nestjs/swagger";

export class EditClient200 {
  @ApiProperty({example: "John Doe"})
  name: string

  @ApiProperty({example: "joedoe@example.com"})
  email: string
}

export class EditClient404 {
  @ApiProperty({example: "Client not found."})
  message: string
}