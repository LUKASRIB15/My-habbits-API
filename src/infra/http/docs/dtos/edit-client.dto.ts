import { ApiProperty } from "@nestjs/swagger";

export class EditClientDTO {
  @ApiProperty({example: "John Doe"})
  name: string

  @ApiProperty({example: "joedoe@example.com"})
  email: string

  @ApiProperty({example: "123456", minLength: 6})
  password: string
}