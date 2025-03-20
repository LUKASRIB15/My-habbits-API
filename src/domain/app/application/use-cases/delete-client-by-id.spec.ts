import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeClient } from "test/makes/make-client"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { DeleteClientByIdUseCase } from "./delete-client-by-id"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"

describe("DeleteClientByIdUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let sut: DeleteClientByIdUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new DeleteClientByIdUseCase(inMemoryClientsRepository)
  })

  it("should be able to delete a client by your id", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({}, new UniqueEntityID('client-1')))

    const result = await sut.execute({
      id: "client-1"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryClientsRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a inexistent client", async ()=>{
    const result = await sut.execute({
      id: "client-with-wrong-id"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})