import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers'

import { makeLogControllerDecorator, makeDbAuthentication, makeLoginValidation } from '@main/factories'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication())

  return makeLogControllerDecorator(loginController)
}
