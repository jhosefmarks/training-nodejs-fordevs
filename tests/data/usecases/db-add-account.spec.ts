import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@tests/data/mocks'
import { mockAccountModel, mockAddAccountParams } from '@tests/domain/mocks'

import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '@data/protocols'
import { DbAddAccount } from '@data/usecases'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null)
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAddAccountParams()

    await sut.add(accountData)

    expect(hashSpy).toBeCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const accountData = mockAddAccountParams()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAddAccountParams()

    await sut.add(accountData)

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const accountData = mockAddAccountParams()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return true if loadAccountByEmailRepositoryStub returns null', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()

    const account = await sut.add(accountData)

    expect(account).toBeTruthy()
  })

  test('Should return false if loadAccountByEmailRepositoryStub returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel())

    const account = await sut.add(mockAddAccountParams())

    expect(account).toBeFalsy()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
