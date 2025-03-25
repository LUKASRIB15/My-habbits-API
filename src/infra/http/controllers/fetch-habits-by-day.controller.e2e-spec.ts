import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { ClientFactory } from "test/factories/client-factory"
import { HabitFactory } from "test/factories/habit-factory"
import { HabitWeekDayFactory } from "test/factories/habit-week-day-factory"
import request from "supertest"

describe("FetchHabitsByDayController (e2e)", ()=>{
  let app: INestApplication
  let jwt: JwtService
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
    clientFactory = moduleRef.get(ClientFactory)
    habitFactory = moduleRef.get(HabitFactory)
    habitWeekDayFactory = moduleRef.get(HabitWeekDayFactory)

    await app.init()
  })

  test("[GET] /habits/day", async ()=>{

    const client = await clientFactory.makePrismaClient({})

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

    const accessToken = jwt.sign({sub: client.id.toValue()})

    const response = await request(app.getHttpServer())
      .get('/habits/day')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({
      habits: expect.arrayContaining([
        expect.objectContaining({
          title: 'Gym'
        }),
        expect.objectContaining({
          title: 'Read books'
        })
      ])
    }))
    expect(response.body.habits).toHaveLength(2)


  })
})