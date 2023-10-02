import { AccountModel } from '@domain/models'
import { AddAccountParams } from '@domain/usecases'

export interface AddAccountReporitory {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
