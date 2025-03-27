import { InMemoryDayHabitsRepository } from "test/repositories/in-memory-day-habits-repository"
import { InMemoryDaysRepository } from "test/repositories/in-memory-days-repository"
import { InMemoryHabitsRepository } from "test/repositories/in-memory-habits-repository"
import { ToggleHabitUseCase } from "./toggle-habit"
import { InMemoryHabitWeekDaysRepository } from "test/repositories/in-memory-habit-week-days-repository"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { makeClient } from "test/makes/make-client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makeHabit } from "test/makes/make-habit"
import { makeHabitWeekDay } from "test/makes/make-habit-week-day"
import { makeDay } from "test/makes/make-day"
import { makeDayHabit } from "test/makes/make-day-habit"
import { ResourceNotFoundError } from "@/core/errors/generic/resource-not-found-error"
import { NoPermissionError } from "@/core/errors/generic/no-permission-error"

describe("ToggleHabitUseCase", ()=>{
  let inMemoryClientsRepository: InMemoryClientsRepository
  let inMemoryHabitWeekDaysRepository: InMemoryHabitWeekDaysRepository
  let inMemoryHabitsRepository: InMemoryHabitsRepository
  let inMemoryDaysRepository: InMemoryDaysRepository
  let inMemoryDayHabitsRepository: InMemoryDayHabitsRepository
  let sut: ToggleHabitUseCase

  beforeEach(()=>{
    inMemoryClientsRepository = new InMemoryClientsRepository()
    inMemoryHabitWeekDaysRepository = new InMemoryHabitWeekDaysRepository()
    inMemoryHabitsRepository = new InMemoryHabitsRepository(inMemoryHabitWeekDaysRepository)
    inMemoryDaysRepository = new InMemoryDaysRepository()
    inMemoryDayHabitsRepository = new InMemoryDayHabitsRepository()
    sut = new ToggleHabitUseCase(inMemoryClientsRepository, inMemoryHabitsRepository, inMemoryDaysRepository, inMemoryDayHabitsRepository)
  
    vi.useFakeTimers()
  })

  afterEach(()=>{
    vi.useRealTimers()
  })

  it("should be able to toggle a habit", async ()=>{
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
      }),
      makeDayHabit({
        dayId: new UniqueEntityID("today"),
        habitId: new UniqueEntityID("habit-2")
      })
    )

    const result = await sut.execute({
      habitId: "habit-1",
      clientId: "client-1",
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryDayHabitsRepository.items).toHaveLength(1)
  })

  it("should not be able to toggle a habit inexistent", async ()=>{
    const result = await sut.execute({
      habitId: "habit-with-wrong-id",
      clientId: "client-1",
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to toggle a habit to belong to another client", async ()=>{

    inMemoryHabitsRepository.items.push(
      makeHabit({
        clientId: new UniqueEntityID("client-1"),
        title: "Exercise 1",
        createdAt: new Date('2025-03-20T03:00:00.000'),
      }, new UniqueEntityID("habit-1")),
    )

    const result = await sut.execute({
      habitId: "habit-1",
      clientId: "client-2",
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NoPermissionError)
  })
})