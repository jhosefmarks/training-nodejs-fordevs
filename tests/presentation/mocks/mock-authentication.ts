import { AddAccount } from '@domain/usecases/add-account'
import { Authentication, AuthenticationParams } from '@domain/usecases/authentication'
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
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return true
    }
  }

  return new AddAccountStub()
}
