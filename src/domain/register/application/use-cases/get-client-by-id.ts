import { Either, failure, success } from "@/core/errors/either";
import { Injectable } from "@nestjs/common";
import { Client } from "../../enterprise/entities/client";
import { ClientsRepository } from "../repositories/clients-repository";
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error";

type GetClientByIdUseCaseRequest = {
  id: string 
}

type GetClientByIdUseCaseResponse = Either<ResourceNotFoundError, {
  client: Client
}>

@Injectable()
export class GetClientByIdUseCase {
  constructor(
    private clientsRepository: ClientsRepository
  ){}

  async execute({id}: GetClientByIdUseCaseRequest): Promise<GetClientByIdUseCaseResponse> {
    const client = await this.clientsRepository.findById(id)

    if(!client){
      return failure(new ResourceNotFoundError("Client not found."))
    }

    return success({
      client,
    })
  }
}