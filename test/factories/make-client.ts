import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client, ClientProps } from "@/domain/register/enterprise/entities/client";
import { PrismaClientsMapper } from "@/infra/database/prisma/mappers/prisma-clients-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import {faker} from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeClient(override: Partial<ClientProps> = {}, id?: UniqueEntityID) {
  return Client.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  }, id)
}

@Injectable()
export class ClientFactory {

  constructor(
    private prisma: PrismaService
  ){}

  async makePrismaClient(data: Partial<ClientProps> = {}) {
    const client = makeClient(data)

    await this.prisma.client.create({
      data: PrismaClientsMapper.toPrisma(client)
    })

    return client
  }
}