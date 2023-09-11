import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccountModel } from '@domain/models/account'

import { Decrypter } from '@data/protocols/cryptography/decrypter'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken)

    await this.loadAccountByTokenRepository.loadByToken(accessToken, role)

    return null
  }
}
