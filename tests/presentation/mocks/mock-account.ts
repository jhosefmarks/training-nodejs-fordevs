import { mockAccountModel } from '@tests/domain/mocks'

import { AccountModel } from '@domain/models'
import { AddAccount , Authentication, LoadAccountByToken } from '@domain/usecases'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return {
        accessToken: 'any_token',
        name: 'any_name'
      }
    }
  }

  return new AuthenticationStub()
}

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }

  return new AddAccountStub()
}

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new LoadAccountByTokenStub()
}
