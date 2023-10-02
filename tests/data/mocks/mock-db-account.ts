import { mockAccountModel } from '@tests/domain/mocks'

import { AccountModel } from '@domain/models'
import { AddAccountParams } from '@domain/usecases'

import {
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  AddAccountReporitory
} from '@data/protocols'

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
