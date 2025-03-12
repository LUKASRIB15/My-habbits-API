import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { GetClientByIdUseCase } from "./get-client-by-id"
import { makeClient } from "test/makes/make-client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"

describe("GetClientByIdUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let sut: GetClientByIdUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    sut = new GetClientByIdUseCase(inMemoryClientsRepository)
  })

  it("should be able to get a client by your id", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      name: "John Doe"
    }, new UniqueEntityID("client-1")))

    const result = await sut.execute({
      id: "client-1"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result.value).toEqual(expect.objectContaining({
      client: expect.objectContaining({
        name: "John Doe"
      })
    }))
  })

  it("should not be able to get a client by wrong id", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      name: "John Doe"
    }, new UniqueEntityID("client-1")))

    const result = await sut.execute({
      id: "client-with-wrong-id"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})