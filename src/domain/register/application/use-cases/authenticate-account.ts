import { Encrypter } from "../cryptography/encrypter"
import { HashComparer } from "../cryptography/hash-comparer"
import { ClientsRepository } from "../repositories/clients-repository"

type AuthenticateAccountUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateAccountUseCaseResponse = {
  accessToken: string
}

export class AuthenticateAccountUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ){}

  async execute({email, password}: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email)

    if(!client) {
      throw new Error("Credentials are invalid.")
    }

    const isPasswordValid = await this.hashComparer.compare(password, client.password)

    if(!isPasswordValid){
      throw new Error("Credentials are invalid.")
    }

    const accessToken = await this.encrypter.encrypt({sub: client.id.toValue()})

    return {
      accessToken,
    }
  }
}