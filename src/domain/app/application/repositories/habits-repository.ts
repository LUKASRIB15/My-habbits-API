import { DateParams } from "@/core/params/date-params";
import { Habit } from "../../enterprise/entities/habit";

export abstract class HabitsRepository {
  abstract create(habit: Habit): Promise<void>
  abstract findManyByClientId(clientId: string, {date, weekDays}: DateParams): Promise<Habit[]>
}