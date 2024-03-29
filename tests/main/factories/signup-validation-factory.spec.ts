import { mockEmailValidator } from '@tests/validation/mocks'

import { Validation } from '@presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@validation/validators'

import { makeSignUpValidation } from '@main/factories'

jest.mock('@validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', mockEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
