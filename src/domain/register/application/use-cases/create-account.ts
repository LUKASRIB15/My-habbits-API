import { Injectable } from "@nestjs/common"
import { Client } from "../../enterprise/entities/client"
import { HashGenerator } from "../cryptography/hash-generator"
import { ClientsRepository } from "../repositories/clients-repository"
import { ConflictError } from "@/core/errors/generic/conflict-error"
import {Either, failure, success } from "@/core/errors/either"

type CreateAccountUseCaseRequest = {
  name: string
  email: string
  password:string
}

type CreateAccountUseCaseResponse = Either<ConflictError, null>

@Injectable()
export class CreateAccountUseCase {

  constructor(
    private clientsRepository: ClientsRepository,
    private hashGenerator: HashGenerator
  ){}
  
  async execute({
    name,
    email,
    password
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const clientWithSameEmail = await this.clientsRepository.findByEmail(email)

    if(clientWithSameEmail){
      return failure(new ConflictError("Client already exists."))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const client = Client.create({
      name,
      email,
      password: passwordHash
    })

    await this.clientsRepository.create(client)

    return success(null)
  }
}