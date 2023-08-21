import { Validation } from './validation'

export class ValidationComposite implements Validation {
  constructor (private readonly valitions: Validation[]) {}

  validate (input: any): Error {
    for (const validation of this.valitions) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
