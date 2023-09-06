import {
  AccountModel,
  AddAccount,
  AddAccountModel,
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

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    const hashedPassword = await this.hasher.hash(accountData.password)

    const account = await this.addAccountReporitory.add(
      Object.assign({}, accountData, { password: hashedPassword }))

    return account
  }
}
