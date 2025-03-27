import { InMemoryHabitsRepository } from "test/repositories/in-memory-habits-repository"
import { FetchHabitsByDayUseCase } from "./fetch-habits-by-day"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { makeClient } from "test/makes/make-client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeHabit } from "test/makes/make-habit"
import { InMemoryHabitWeekDaysRepository } from "test/repositories/in-memory-habit-week-days-repository"
import { makeHabitWeekDay } from "test/makes/make-habit-week-day"
import { InMemoryDaysRepository } from "test/repositories/in-memory-days-repository"
import { InMemoryDayHabitsRepository } from "test/repositories/in-memory-day-habits-repository"
import { makeDay } from "test/makes/make-day"
import { makeDayHabit } from "test/makes/make-day-habit"

describe("FetchHabitsByDayUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let inMemoryHabitWeekDaysRepository: InMemoryHabitWeekDaysRepository
  let inMemoryHabitsRepository: InMemoryHabitsRepository
  let inMemoryDaysRepository: InMemoryDaysRepository
  let inMemoryDayHabitsRepository: InMemoryDayHabitsRepository
  let sut: FetchHabitsByDayUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryHabitWeekDaysRepository = new InMemoryHabitWeekDaysRepository()
    inMemoryHabitsRepository = new InMemoryHabitsRepository(inMemoryHabitWeekDaysRepository)
    inMemoryDaysRepository = new InMemoryDaysRepository()
    inMemoryDayHabitsRepository = new InMemoryDayHabitsRepository()
    sut = new FetchHabitsByDayUseCase(inMemoryHabitsRepository, inMemoryDaysRepository, inMemoryDayHabitsRepository)

    vi.useFakeTimers()
  })

  afterEach(()=>{
    vi.useRealTimers()
  })


  it("should be able to get habits by day", async ()=>{
    vi.setSystemTime(new Date('2025-03-21T03:00:00.000'))

    inMemoryClientsRepository.items.push(makeClient({}, new UniqueEntityID("client-1")))

    inMemoryHabitsRepository.items.push(
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 1",
        createdAt: new Date('2025-03-20T03:00:00.000'),
      }, new UniqueEntityID("habit-1")),
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 2",
        createdAt: new Date('2025-03-19T03:00:00.000'),
      }, new UniqueEntityID("habit-2")),
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 3",
        createdAt: new Date('2025-03-23T03:00:00.000'),
      }, new UniqueEntityID("habit-3")),
    )

    inMemoryHabitWeekDaysRepository.items.push(
      makeHabitWeekDay({
        weekDay: 3,
        habitId: new UniqueEntityID("habit-2")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-1")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-2")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-3")
      }),
    )

    const result = await sut.execute({
      date: new Date(),
      clientId: "client-1"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result.value?.possibleHabits).toHaveLength(2)
    expect(result.value?.completedHabits).toHaveLength(0)
    expect(result.value?.possibleHabits).toEqual(expect.arrayContaining([
      expect.objectContaining({
        props: expect.objectContaining({
          title: "Exercise 1",
        })
      }),
      expect.objectContaining({
        props: expect.objectContaining({
          title: "Exercise 2",
        })
      })
    ]))
  })

  it("should not be able to get habits by day of other client", async ()=>{
    vi.setSystemTime(new Date('2025-03-21T03:00:00.000'))

    inMemoryClientsRepository.items.push(makeClient({}, new UniqueEntityID("client-2")))

    inMemoryHabitsRepository.items.push(
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 1",
        createdAt: new Date('2025-03-20T03:00:00.000'),
      }, new UniqueEntityID("habit-1")),
    )

    inMemoryHabitWeekDaysRepository.items.push(
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-1")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-1")
      }),
    )

    const result = await sut.execute({
      date: new Date(),
      clientId: "client-2"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result.value?.possibleHabits).toHaveLength(0)
  })

  it("should be able to get habits by day with completed habits of day", async ()=>{
    vi.setSystemTime(new Date('2025-03-21T03:00:00.000'))

    inMemoryClientsRepository.items.push(makeClient({}, new UniqueEntityID("client-1")))

    inMemoryHabitsRepository.items.push(
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 1",
        createdAt: new Date('2025-03-20T03:00:00.000'),
      }, new UniqueEntityID("habit-1")),
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 2",
        createdAt: new Date('2025-03-19T03:00:00.000'),
      }, new UniqueEntityID("habit-2")),
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 3",
        createdAt: new Date('2025-03-23T03:00:00.000'),
      }, new UniqueEntityID("habit-3")),
    )

    inMemoryHabitWeekDaysRepository.items.push(
      makeHabitWeekDay({
        weekDay: 3,
        habitId: new UniqueEntityID("habit-2")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-1")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-2")
      }),
      makeHabitWeekDay({
        weekDay: 5,
        habitId: new UniqueEntityID("habit-3")
      }),
    )

    inMemoryDaysRepository.items.push(
      makeDay({}, new UniqueEntityID("today"))
    )

    
    inMemoryDayHabitsRepository.items.push(
      makeDayHabit({
        dayId: new UniqueEntityID("today"),
        habitId: new UniqueEntityID("habit-1")
      })
    )
    
    const result = await sut.execute({
      clientId: "client-1",
      date: new Date()
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result.value?.possibleHabits).toHaveLength(2)
    expect(result.value?.completedHabits).toHaveLength(1)
    expect(result.value?.completedHabits).toEqual(expect.arrayContaining([
      expect.objectContaining({
        props: expect.objectContaining({
          habitId: new UniqueEntityID('habit-1'),
        })
      })
    ]))
  })
})