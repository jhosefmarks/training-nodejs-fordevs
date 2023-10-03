import { mockAccountModel } from '@tests/domain/mocks'

import { AccountModel } from '@domain/models'

import {
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
  AddAccountRepository
} from '@data/protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      const fakeAccount = mockAccountModel()

      return fakeAccount
    }
  }

  return new AddAccountRepositoryStub()
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
