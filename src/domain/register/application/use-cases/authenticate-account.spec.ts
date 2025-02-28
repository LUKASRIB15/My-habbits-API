import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { AuthenticateAccountUseCase } from "./authenticate-account"
import { makeClient } from "test/factories/make-client"
import { UnauthorizedError } from "@/core/errors/generic/unauthorized-error"

describe("AuthenticateAccountUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateAccountUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAccountUseCase(inMemoryClientsRepository, fakeHasher, fakeEncrypter)
  })

  it("should be able to authenticate account of client", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      name: "John Doe",
      email: "johnDoe@example.com",
      password: "123456-hashed"
    }))
    
    const result = await sut.execute({
      email: "johnDoe@example.com",
      password: "123456"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result.value).toEqual(expect.objectContaining({
      accessToken: expect.any(String)
    }))
  })

  it("should not be able to authenticate account with wrong credentials", async ()=>{
    inMemoryClientsRepository.items.push(makeClient({
      name: "John Doe",
      email: "johnDoe@example.com",
      password: "123456-hashed"
    }))
    
    const result = await sut.execute({
      email: "otherJohnDoe@example.com",
      password: "wrong-password"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})