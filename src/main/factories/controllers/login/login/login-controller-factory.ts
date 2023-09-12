import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers/login/login/login-controller'

import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication())

  return makeLogControllerDecorator(loginController)
}
