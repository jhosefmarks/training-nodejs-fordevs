import { SignUpController } from '@presentation/controllers/login/signup/signup-controller'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@main/factories/usecases/account/add-account/db-add-account-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(
    makeSignUpValidation(), makeDbAddAccount(), makeDbAuthentication()
  )

  return makeLogControllerDecorator(signUpController)
}
