import { Habit } from "@/domain/app/enterprise/entities/habit";

export class HabitsPresenter {
  static toHTTP(habit: Habit){
    return {
      id: habit.id.toValue(),
      title: habit.title
    }
  }
}