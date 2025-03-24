import { WatchedList } from "@/core/entities/watched-list";
import { HabitWeekDays } from "./habit-week-days";

export class HabitWeekDaysList extends WatchedList<HabitWeekDays> {
  compareItems(a: HabitWeekDays, b: HabitWeekDays): boolean {
    return a.habitId.equals(b.habitId)
  }
}