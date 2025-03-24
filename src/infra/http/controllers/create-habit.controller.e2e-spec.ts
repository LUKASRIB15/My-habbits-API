import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ClientFactory } from "test/factories/client-factory"

describe("CreateHabitController (e2e)", ()=>{
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let clientFactory: ClientFactory

  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  test("[POST] /habits/new", async ()=>{
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({sub: client.id.toValue()})

    const response = await request(app.getHttpServer())
      .post('/habits/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: "Gym",
        weekDays: [1,2,3,4,5]
      })

    expect(response.statusCode).toBe(201)

    const habitOnDatabase = await prisma.habit.findFirst({
      where: {
        title: 'Gym'
      }
    })

    expect(habitOnDatabase).toBeTruthy()

    const habitWeekDaysOnDatabase = await prisma.habitWeekDays.findMany({
      where: {
        habitId: habitOnDatabase!.id
      }
    })

    expect(habitWeekDaysOnDatabase).toHaveLength(5)
  })
})