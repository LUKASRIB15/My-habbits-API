import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { EditClientUseCase } from "./edit-client"
import { makeClient } from "test/makes/make-client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"

describe("EditClientUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let fakeHasher: FakeHasher
  let sut: EditClientUseCase
  
  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    sut = new EditClientUseCase(inMemoryClientsRepository, fakeHasher)
  })

  it("should be able to edit an account of client", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      name: "John Doe"
    }, new UniqueEntityID('client-1')))

    const result = await sut.execute({
      id: "client-1",
      name: "John Doe edited",
      email: "johnDoe@example.com",
      password: "123456"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryClientsRepository.items[0].name).toBe("John Doe edited")
  })

  it("should not be able to edit an account inexistent client", async ()=>{
    const result = await sut.execute({
      id: "client-with-wrong-id",
      name: "John Doe edited",
      email: "johnDoe@example.com",
      password: "123456"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})