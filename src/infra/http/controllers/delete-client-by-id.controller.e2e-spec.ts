import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { ClientFactory } from "test/factories/client-factory"
import request from "supertest"

describe("DeleteClientByIdController (e2e)", ()=>{
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let clientFactory: ClientFactory

  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  test("[DELETE] /clients/me/delete", async ()=>{
    const client = await clientFactory.makePrismaClient({})

    const accessToken = jwt.sign({sub: client.id.toValue()})
    
    const response = await request(app.getHttpServer())
      .delete('/clients/me/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const clientOnDatabase = await prisma.client.findUnique({
      where: {
        id: client.id.toValue()
      }
    })

    expect(clientOnDatabase).toBeNull()
  })
})