import { ConfigService } from "@nestjs/config";
import { Env } from ".";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<Env, true>
  ){}

  get<T extends keyof Env>(key: T){
    return this.configService.get(key)
  }
}