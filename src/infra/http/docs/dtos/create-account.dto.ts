import { ApiProperty } from "@nestjs/swagger"

export class CreateAccountDTO{
  @ApiProperty({example: "John Client"})
  name: string

  @ApiProperty({example: "client@email.com"})
  email: string

  @ApiProperty({example: "123456", minLength: 6})
  password: string
}