import { Either, failure, success } from "@/core/errors/either"
import { ClientsRepository } from "../repositories/clients-repository"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"
import { Injectable } from "@nestjs/common"

type DeleteClientByIdUseCaseRequest = {
  id: string
}

type DeleteClientByIdUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteClientByIdUseCase {
  constructor(
    private clientsRepository: ClientsRepository
  ){}

  async execute({id}: DeleteClientByIdUseCaseRequest): Promise<DeleteClientByIdUseCaseResponse>{
    const client = await this.clientsRepository.findById(id)

    if(!client){
      return failure(new ResourceNotFoundError("Client not found."))
    }

    await this.clientsRepository.delete(client)

    return success(null)
  }
}
