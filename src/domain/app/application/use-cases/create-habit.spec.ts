import { InMemoryHabitsRepository } from "test/repositories/in-memory-habits-repository"
import { CreateHabitUseCase } from "./create-habit"
import { WeekDaysIsEmptyError } from "./errors/week-days-is-empty-error"
import { InMemoryHabitWeekDaysRepository } from "test/repositories/in-memory-habit-week-days-repository"

describe("CreateHabitUseCase", ()=>{
  let inMemoryHabitWeekDaysRepository: InMemoryHabitWeekDaysRepository
  let inMemoryHabitsRepository: InMemoryHabitsRepository
  let sut: CreateHabitUseCase
  
  beforeEach(()=>{
    inMemoryHabitWeekDaysRepository = new InMemoryHabitWeekDaysRepository()
    inMemoryHabitsRepository = new InMemoryHabitsRepository(inMemoryHabitWeekDaysRepository)
    sut = new CreateHabitUseCase(inMemoryHabitsRepository)
  })

  it("should be able to create a new habit", async ()=>{
    const result = await sut.execute({
      title: "Exercise",
      weekDays: [1, 2, 3, 4, 5],
      clientId: "client-1"
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(inMemoryHabitsRepository.items).toHaveLength(1)
    expect(inMemoryHabitWeekDaysRepository.items).toHaveLength(5)
  })

  it("should not be able to create a new habit with zero weekDays", async ()=>{
    const result = await sut.execute({
      title: "Exercise",
      weekDays: [],
      clientId: "client-1"
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(WeekDaysIsEmptyError)
  })
})