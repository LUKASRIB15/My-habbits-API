import { HashComparer } from "@/domain/register/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/register/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

const SALT_LENGTH = 8

@Injectable()
export class BcryptjsHasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    return await hash(plainText, SALT_LENGTH)
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return await compare(plainText, hash)
  }
}