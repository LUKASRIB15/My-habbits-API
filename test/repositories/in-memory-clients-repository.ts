import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ClientsRepository } from "@/domain/app/application/repositories/clients-repository";
import { Client } from "@/domain/app/enterprise/entities/client";

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async create(client: Client): Promise<void> {
    this.items.push(client)
  }

  async update(client: Client): Promise<void> {
    const clientIndex = this.items.findIndex(item=> item.id.equals(client.id))

    this.items[clientIndex] = client
  }

  async delete(client: Client): Promise<void>{
    this.items = this.items.filter(item=> item.id.toValue() !== client.id.toValue())
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find(item => item.email === email)

    if(!client){
      return null
    }

    return client
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find(item => item.id.equals(new UniqueEntityID(id)))

    if(!client){
      return null
    }

    return client
  }
}