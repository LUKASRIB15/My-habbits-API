import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { hash } from "bcryptjs"
import { ClientFactory } from "test/factories/make-client"

describe("AuthenticateAccountController (e2e)", ()=>{
  let app: INestApplication
  let clientFactory: ClientFactory

  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })
  
  it("[POST] /clients/auth", async ()=>{
    await clientFactory.makePrismaClient({
      email: "johnDoe@example.com",
      password: await hash("123456", 8)
    })

    const response = await request(app.getHttpServer())
      .post('/clients/auth')
      .send({
        email: "johnDoe@example.com",
        password: "123456"
      })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({ 
      access_token: expect.any(String) 
    })
  })
})