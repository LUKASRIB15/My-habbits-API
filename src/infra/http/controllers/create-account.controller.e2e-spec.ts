import { AppModule } from "@/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("CreateAccountController (e2e)", ()=>{
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
    .compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  it("[POST] /clients/new", async ()=>{
    const response = await request(app.getHttpServer())
      .post('/clients/new')
      .send({
        name: "John Doe",
        email: "johnDoe@example.com",
        password: "123456"
      })

    expect(response.statusCode).toBe(201)

    const clientOnDatabase = await prisma.client.findUnique({
      where: {
        email: "johnDoe@example.com"
      }
    })

    expect(clientOnDatabase).toBeTruthy()


  })
})