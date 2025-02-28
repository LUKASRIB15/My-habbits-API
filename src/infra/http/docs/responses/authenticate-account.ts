import { ApiProperty } from "@nestjs/swagger"

export class AuthenticateAccount200 {
  @ApiProperty({example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJleHAiOjE2MjAwMDAwMDB9.invalidsignature"})
  access_token: string
}

export class AuthenticateAccount401 {
  @ApiProperty({example: "Credentials are invalid."})
  message: string
}