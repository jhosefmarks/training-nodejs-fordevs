import { mockAddAccountReporitory, mockHasher, mockLoadAccountByEmailRepository } from '@data/test'
import { mockAccountModel, mockAddAccountParams } from '@domain/test'

import { AddAccountParams, AddAccountReporitory, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'
import { DbAddAccount } from '@data/usecases/account/add-account/db-add-account'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountReporitoryStub: AddAccountReporitory
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountReporitoryStub = mockAddAccountReporitory()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null)
  const sut = new DbAddAccount(hasherStub, addAccountReporitoryStub, loadAccountByEmailRepositoryStub)

  return { sut, hasherStub, addAccountReporitoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData: AddAccountParams = mockAddAccountParams()

    await sut.add(accountData)

    expect(hashSpy).toBeCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const accountData: AddAccountParams = mockAddAccountParams()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountReporitory with correct values', async () => {
    const { sut, addAccountReporitoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountReporitoryStub, 'add')
    const accountData: AddAccountParams = mockAddAccountParams()

    await sut.add(accountData)

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountReporitory throws', async () => {
    const { sut, addAccountReporitoryStub } = makeSut()
    jest.spyOn(addAccountReporitoryStub, 'add').mockRejectedValueOnce(new Error())
    const accountData: AddAccountParams = mockAddAccountParams()

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { sut } = makeSut()
    const accountData: AddAccountParams = mockAddAccountParams()

    const account = await sut.add(accountData)

    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(mockAccountModel())

    const account = await sut.add(mockAddAccountParams())

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(mockAddAccountParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
