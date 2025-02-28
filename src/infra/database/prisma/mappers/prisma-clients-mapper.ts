import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client } from "@/domain/register/enterprise/entities/client";
import { Prisma } from "@prisma/client";

export class PrismaClientsMapper {
  static toDomain(raw: Prisma.ClientUncheckedCreateInput): Client{
    return Client.create({
      name: raw.name,
      email: raw.email,
      password: raw.password
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput{
    return {
      id: client.id.toValue(),
      name: client.name,
      email: client.email,
      password: client.password
    }
  }
}