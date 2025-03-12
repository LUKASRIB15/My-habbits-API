import { Client } from "../../enterprise/entities/client";

export abstract class ClientsRepository {
  abstract create(client: Client): Promise<void>
  abstract findByEmail(email: string): Promise<Client | null>
  abstract findById(id: string): Promise<Client | null>
}