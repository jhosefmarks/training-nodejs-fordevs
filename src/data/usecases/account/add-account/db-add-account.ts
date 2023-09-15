import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  AddAccountReporitory,
  LoadAccountByEmailRepository,
  Hasher
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountReporitory: AddAccountReporitory,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password)

      const newAccount = await this.addAccountReporitory.add(
        Object.assign({}, accountData, { password: hashedPassword }))

      return newAccount
    }

    return null
  }
}
