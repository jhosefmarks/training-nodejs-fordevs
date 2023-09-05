import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '@infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '@presentation/controllers/signup/signup-controller'
import { Controller } from '@presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeSignUpController = (): Controller => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoReporitory = new AccountMongoRepository()

  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoReporitory)

  const validationComposite = makeSignUpValidation()

  const signUpController = new SignUpController(validationComposite, dbAddAccount)

  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
