import { Client } from "@/domain/app/enterprise/entities/client";

export class ClientsPresenter {
  static toHTTP(client: Client){
    return {
      name: client.name,
      email: client.email
    }
  }
}