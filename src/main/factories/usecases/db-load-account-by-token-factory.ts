import { DbLoadAccountByToken } from '@data/usecases'
import { LoadAccountByToken } from '@domain/usecases'
import { AccountMongoRepository } from '@infra/db/mongodb'
import { JwtAdapter } from '@infra/cryptography'

import env from '@main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
