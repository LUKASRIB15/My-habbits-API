import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { CreateAccountUseCase } from "./create-account"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { makeClient } from "test/makes/make-client"
import { ConflictError } from "@/core/errors/generic/conflict-error"

describe("CreateAccountUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let fakeHasher: FakeHasher
  let sut: CreateAccountUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAccountUseCase(inMemoryClientsRepository, fakeHasher)
  })

  it("should be able to create account of client", async ()=>{

    const result = await sut.execute({
      name: "John Doe",
      email: "johnDoe@example.com",
      password: "123456"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryClientsRepository.items).toHaveLength(1)
    expect(inMemoryClientsRepository.items[0].password).toBe("123456-hashed")
  })

  it("should not be able  to create account with email of other client", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      email: "johnDoe@example.com"
    }))

    const result = await sut.execute({
      name: "John Doe",
      email: "johnDoe@example.com",
      password: "123456"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})