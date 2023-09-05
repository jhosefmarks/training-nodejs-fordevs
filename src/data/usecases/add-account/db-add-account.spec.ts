import { AccountModel, AddAccountModel, AddAccountReporitory, Hasher } from '@data/usecases/add-account/db-add-account-protocols'
import { DbAddAccount } from '@data/usecases/add-account/db-add-account'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountReporitoryStub: AddAccountReporitory
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new HasherStub()
}

const makeAddAccountReporitory = (): AddAccountReporitory => {
  class AddAccountReporitoryStub implements AddAccountReporitory {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()

      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountReporitoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountReporitoryStub = makeAddAccountReporitory()
  const sut = new DbAddAccount(hasherStub, addAccountReporitoryStub)

  return { sut, hasherStub, addAccountReporitoryStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData: AddAccountModel = makeFakeAccountData()

    await sut.add(accountData)

    expect(hashSpy).toBeCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData: AddAccountModel = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountReporitory with correct values', async () => {
    const { sut, addAccountReporitoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountReporitoryStub, 'add')
    const accountData: AddAccountModel = makeFakeAccountData()

    await sut.add(accountData)

    expect(addSpy).toBeCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountReporitory throws', async () => {
    const { sut, addAccountReporitoryStub } = makeSut()
    jest.spyOn(addAccountReporitoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData: AddAccountModel = makeFakeAccountData()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut()
    const accountData: AddAccountModel = makeFakeAccountData()

    const account = await sut.add(accountData)

    expect(account).toEqual(makeFakeAccount())
  })
})
