import { ApiProperty } from "@nestjs/swagger";

export class DeleteClientById404 {
  @ApiProperty({example: "Client not found."})
  message: string
}