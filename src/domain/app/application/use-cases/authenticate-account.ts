import { Injectable } from "@nestjs/common"
import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { ClientsRepository } from "../repositories/clients-repository"
import { Either, failure, success } from "@/core/errors/either"
import { UnauthorizedError } from "@/core/errors/generic/unauthorized-error"

type AuthenticateAccountUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateAccountUseCaseResponse = Either<UnauthorizedError, {
  accessToken: string
}>

@Injectable()
export class AuthenticateAccountUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ){}

  async execute({email, password}: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email)

    if(!client) {
      return failure(new UnauthorizedError("Credentials are invalid."))
    }

    const isPasswordValid = await this.hashComparer.compare(password, client.password)

    if(!isPasswordValid){
      return failure(new UnauthorizedError("Credentials are invalid."))
    }

    const accessToken = await this.encrypter.encrypt({sub: client.id.toValue()})

    return success({
      accessToken,
    })
  }
}