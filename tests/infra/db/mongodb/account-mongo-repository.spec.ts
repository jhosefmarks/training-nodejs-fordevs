import { Collection } from 'mongodb'

import { mockAddAccountParams } from '@tests/domain/mocks'

import env from '@main/config/env'

import { MongoHelper , AccountMongoRepository } from '@infra/db/mongodb'

let accountCollection: Collection

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.diconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()

      const isValid = await sut.add(mockAddAccountParams())

      expect(isValid).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(mockAddAccountParams())

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({ accessToken: 'any_token', ...mockAddAccountParams() })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({ ...mockAddAccountParams(), accessToken: 'any_token' })

      const account = await sut.loadByToken('any_token', 'invalid_role')

      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        ...mockAddAccountParams(),
        accessToken: 'any_token',
        role: 'admin'
      })

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('any_token')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(mockAddAccountParams())
      const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })

      expect(fakeAccount?.accessToken).toBeFalsy()

      await sut.updateAccessToken(fakeAccount?._id.toHexString() || '', 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount?._id })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
