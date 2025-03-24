export class WeekDaysIsEmptyError extends Error {
  constructor(){
    super('A habit needs at least one week day.')
  }
}