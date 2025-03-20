import { HashGenerator } from "@/domain/app/application/cryptography/hash-generator";
import { Module } from "@nestjs/common";
import { BcryptjsHasher } from "./bcryptjs-hasher";
import { HashComparer } from "@/domain/app/application/cryptography/hash-comparer";
import { Encrypter } from "@/domain/app/application/cryptography/encrypter";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BcryptjsHasher
    },
    {
      provide: HashComparer,
      useClass: BcryptjsHasher
    },
    {
      provide: Encrypter,
      useClass: JwtEncrypter
    }
  ],
  exports: [
    HashGenerator,
    HashComparer,
    Encrypter
  ]
})
export class CryptographyModule {}