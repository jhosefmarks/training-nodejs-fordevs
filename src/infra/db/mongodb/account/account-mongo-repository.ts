import { ObjectId } from 'mongodb'

import { AddAccountReporitory } from '@data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/account/update-access-token-repository'
import { AddAccountModel } from '@domain/usecases/add-account'
import { AccountModel } from '@domain/models/account'

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountReporitory, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
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
