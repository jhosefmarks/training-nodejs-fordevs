import { AccountModel } from '@domain/models'
import { AddAccount , AuthenticationParams } from '@domain/usecases'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel =>
  ({ id: 'any_id', ...mockAddAccountParams() })

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
