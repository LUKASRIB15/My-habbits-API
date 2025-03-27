import { DayHabit } from "@/domain/app/enterprise/entities/day-habit";

export class DayHabitsPresenter {
  static toHTTP(dayHabit: DayHabit){
    return {
      habitId: dayHabit.habitId.toValue(),
    }
  }
}