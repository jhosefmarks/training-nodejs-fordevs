import { ObjectId } from 'mongodb'

import {
  AddAccountReporitory,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@data/protocols'
import { AddAccountParams } from '@domain/usecases'
import { AccountModel } from '@domain/models'

import { MongoHelper } from '@infra/db/mongodb'

export class AccountMongoRepository
implements AddAccountReporitory, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const account = await accountCollection.findOne({ _id: result.insertedId })

    return MongoHelper.map(account)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })

    return account && MongoHelper.map(account)
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne(role ? { accessToken: token, role } : { accessToken: token })

    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } })
  }
}
