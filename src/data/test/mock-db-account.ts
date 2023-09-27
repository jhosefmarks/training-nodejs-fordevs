import { mockAccountModel } from '@domain/test'

import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/account/add-account'
import { AddAccountReporitory } from '@data/protocols/db/account/add-account-repository'

export const mockAddAccountReporitory = (): AddAccountReporitory => {
  class AddAccountReporitoryStub implements AddAccountReporitory {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      const fakeAccount = mockAccountModel()

      return fakeAccount
    }
  }

  return new AddAccountReporitoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {}
  }

  return new UpdateAccessTokenRepositoryStub()
}
