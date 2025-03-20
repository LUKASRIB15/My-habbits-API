import { ClientProps } from "@/domain/app/enterprise/entities/client"
import { PrismaClientsMapper } from "@/infra/database/prisma/mappers/prisma-clients-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { makeClient } from "test/makes/make-client"

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