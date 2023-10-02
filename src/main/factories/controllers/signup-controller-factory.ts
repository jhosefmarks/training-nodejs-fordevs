import { SignUpController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeLogControllerDecorator, makeDbAuthentication, makeSignUpValidation, makeDbAddAccount } from '@main/factories'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeSignUpValidation(), makeDbAddAccount(), makeDbAuthentication()
  )

  return makeLogControllerDecorator(signUpController)
}
