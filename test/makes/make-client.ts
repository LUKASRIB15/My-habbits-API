import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client, ClientProps } from "@/domain/register/enterprise/entities/client";
import {faker} from "@faker-js/faker";

export function makeClient(override: Partial<ClientProps> = {}, id?: UniqueEntityID) {
  return Client.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  }, id)
}