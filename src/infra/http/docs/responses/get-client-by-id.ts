import { ApiProperty } from "@nestjs/swagger";

export class GetClientById200 {
  @ApiProperty({example: "John Client"})
  name: string

  @ApiProperty({example: "client@email.com"})
  email: string
}

export class GetClientById404 {
  @ApiProperty({example: "Client not found."})
  message: string
}