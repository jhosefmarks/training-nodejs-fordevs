import { mockAddAccountRepository, mockCheckAccountByEmailRepository, mockHasher } from '@tests/data/mocks'
import { mockAddAccountParams } from '@tests/domain/mocks'

import { AddAccountRepository, CheckAccountByEmailRepository, Hasher } from '@data/protocols'
import { DbAddAccount } from '@data/usecases'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub)

  return { sut, hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub }
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

  test('Should return true on success', async () => {
    const { sut } = makeSut()

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBeTruthy()
  })

  test('Should return false if addAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(false)

    const isValid = await sut.add(mockAddAccountParams())

    expect(isValid).toBeFalsy()
  })

  test('Should return false if CheckAccountByEmailRepository returns an account', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockResolvedValueOnce(true)

    const account = await sut.add(mockAddAccountParams())

    expect(account).toBeFalsy()
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
