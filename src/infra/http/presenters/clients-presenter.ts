import { Client } from "@/domain/register/enterprise/entities/client";

export class ClientsPresenter {
  static toHTTP(client: Client){
    return {
      name: client.name,
      email: client.email
    }
  }
}