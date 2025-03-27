import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { ClientFactory } from "test/factories/client-factory"
import { HabitFactory } from "test/factories/habit-factory"
import { HabitWeekDayFactory } from "test/factories/habit-week-day-factory"
import request from "supertest"
import { PrismaService } from "@/infra/database/prisma/prisma.service"

describe("ToggleHabitController (e2e)", ()=>{
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let habitFactory: HabitFactory
  let habitWeekDayFactory: HabitWeekDayFactory

  const tomorrow = new Date().getDay() + 1
  const today = new Date().getDay()

  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ClientFactory, HabitFactory, HabitWeekDayFactory]
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    habitFactory = moduleRef.get(HabitFactory)
    habitWeekDayFactory = moduleRef.get(HabitWeekDayFactory)

    await app.init()
  })

  test("[PATCH] /habits/:id/toggle", async ()=>{
    const client = await clientFactory.makePrismaClient()

    const accessToken = jwt.sign({sub: client.id.toValue()})

    const habitOne = await habitFactory.makePrismaHabit({
      clientId: client.id,
      title: "Gym",
    })

    const habitTwo = await habitFactory.makePrismaHabit({
      clientId: client.id,
      title: "Read books",
    })
    
    await Promise.all([
      habitWeekDayFactory.makePrismaHabitWeekDay({
        habitId: habitOne.id,
        weekDay: today
      }),
  
      habitWeekDayFactory.makePrismaHabitWeekDay({
        habitId: habitOne.id,
        weekDay: tomorrow
      }),
      
      habitWeekDayFactory.makePrismaHabitWeekDay({
        habitId: habitTwo.id,
        weekDay: today
      })
    ])

    const response = await request(app.getHttpServer())
      .patch(`/habits/${habitOne.id}/toggle`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const completedHabit = await prisma.dayHabit.findMany()

    expect(completedHabit[0].habitId).toBe(habitOne.id.toValue())

    
  })
})