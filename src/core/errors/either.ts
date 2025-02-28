class Failure<F, S> {
  readonly value: F

  constructor(value: F){
    this.value = value
  }

  isSuccess(): this is Success<F, S>{
    return false
  }

  isFailure(): this is Failure<F, S>{
    return true
  }
}

class Success<F, S>{
  readonly value: S

  constructor(value: S){
    this.value = value
  }

  isSuccess(): this is Success<F, S>{
    return true
  }

  isFailure(): this is Failure<F, S>{
    return false
  }
}

export type Either<F, S> = Failure<F, S> | Success<F, S>

export const success = <F, S>(value: S): Either<F, S> => new Success(value)
export const failure = <F, S>(value: F): Either<F, S> => new Failure(value)