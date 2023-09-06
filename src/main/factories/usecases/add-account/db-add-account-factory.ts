import { DbAddAccount } from '@data/usecases/add-account/db-add-account'
import { AddAccount } from '@domain/usecases/add-account'
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter/bcrypt-adapter'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoReporitory = new AccountMongoRepository()

  return new DbAddAccount(bcryptAdapter, accountMongoReporitory, accountMongoReporitory)
}
