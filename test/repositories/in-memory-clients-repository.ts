import { ClientsRepository } from "src/domain/register/application/repositories/clients-repository";
import { Client } from "src/domain/register/enterprise/entities/client";

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async create(client: Client): Promise<void> {
    this.items.push(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = this.items.find(item => item.email === email)

    if(!client){
      return null
    }

    return client
  }
}