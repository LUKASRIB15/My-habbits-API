import { ApiProperty } from "@nestjs/swagger"

export class AuthenticateAccountDTO {
  @ApiProperty({example: "client@email.com"})
  email: string

  @ApiProperty({example: "123456"})
  password: string
}