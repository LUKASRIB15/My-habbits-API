import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { ClientFactory } from "test/factories/client-factory"
import request from "supertest"
import { JwtService } from "@nestjs/jwt"

describe("EditClientController (e2e)", ()=>{
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory
  
  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  test("[PUT] /clients/me/edit", async ()=>{
    const client = await clientFactory.makePrismaClient({
      name: "John Doe"
    })

    const accessToken = jwt.sign({sub: client.id.toValue()})

    const response = await request(app.getHttpServer())
      .put("/clients/me/edit")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe edited",
        email: "johnDoe@example.com",
        password: "123456"
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: "John Doe edited"
    }))
  })
})