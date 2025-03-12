import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { hash } from "bcryptjs"
import { ClientFactory } from "test/factories/client-factory"
import request from "supertest"
import { JwtService } from "@nestjs/jwt"

describe("GetClientByIdController (e2e)", ()=>{
  let app: INestApplication
  let jwt: JwtService
  let clientFactory: ClientFactory

  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  test("[GET] /clients/me", async()=>{
    const client = await clientFactory.makePrismaClient({
      email: "johnDoe@example.com",
      password: await hash("123456", 8)
    })

    const accessToken = jwt.sign({sub: client.id.toValue()})

    const response = await request(app.getHttpServer())
      .get('/clients/me')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: expect.any(String),
      email: "johnDoe@example.com"
    }))

  })
})