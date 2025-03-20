import { Either, failure, success } from "@/core/errors/either"
import { Client } from "../../enterprise/entities/client"
import { ClientsRepository } from "../repositories/clients-repository"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"
import { HashGenerator } from "../cryptography/hash-generator"
import { Injectable } from "@nestjs/common"

type EditClientUseCaseRequest = {
  id: string
  name: string
  email: string
  password: string
}

type EditClientUseCaseResponse = Either<ResourceNotFoundError, {
  client: Client
}>

@Injectable()
export class EditClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator
  ){}

  async execute({id, name, email, password}: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(id)

    if(!client){
      return failure(new ResourceNotFoundError('Client not found.'))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    client.name = name
    client.email = email
    client.password = passwordHash

    await this.clientsRepository.update(client)

    return success({
      client,
    })
  }
}