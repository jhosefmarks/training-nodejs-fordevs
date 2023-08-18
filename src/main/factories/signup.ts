import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoReporitory = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoReporitory)

  const emailValidator = new EmailValidatorAdapter()

  const signUpController = new SignUpController(emailValidator, dbAddAccount)

  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}