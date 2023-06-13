import { AccountModel, AddAccount, AddAccountModel, AddAccountReporitory, Encrypter } from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountReporitory: AddAccountReporitory) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    await this.addAccountReporitory.add(
      Object.assign({}, accountData, { password: hashedPassword }))

    return new Promise(resolve => resolve(null))
  }
}
