import { AccountModel } from '@domain/models/account'
import { AddAccountParams } from '@domain/usecases/account/add-account'

export interface AddAccountReporitory {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
