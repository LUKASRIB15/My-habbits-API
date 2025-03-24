import { Habit } from "@/domain/app/enterprise/entities/habit";

export class HabitsPresenter {
  static toHTTP(habit: Habit){
    return {
      title: habit.title
    }
  }
}