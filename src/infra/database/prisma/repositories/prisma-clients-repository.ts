import { ClientsRepository } from "@/domain/register/application/repositories/clients-repository";
import { Client } from "@/domain/register/enterprise/entities/client";
import { PrismaClientsMapper } from "../mappers/prisma-clients-mapper";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(
    private prisma: PrismaService
  ){}

  async create(client: Client): Promise<void> {
    const data = PrismaClientsMapper.toPrisma(client)

    await this.prisma.client.create({
      data
    })
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        email
      }
    })

    if(!client){
      return null
    }

    return PrismaClientsMapper.toDomain(client)
  }

  async findById(id: string): Promise<Client | null>{
    const client = await this.prisma.client.findUnique({
      where: {
        id
      }
    })

    if(!client){
      return null
    }

    return PrismaClientsMapper.toDomain(client)
  }
}