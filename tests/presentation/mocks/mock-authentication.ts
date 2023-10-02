import { mockAccountModel } from '@tests/domain/mocks'

import { AccountModel } from '@domain/models/account'
import { AddAccount, AddAccountParams } from '@domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@domain/usecases/account/authentication'
import { AuthenticationModel } from '@domain/models/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
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
    async add (account: AddAccountParams): Promise<AccountModel> {
      return mockAccountModel()
    }
  }

  return new AddAccountStub()
}
