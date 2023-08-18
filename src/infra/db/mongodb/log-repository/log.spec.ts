import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoReporitory } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.diconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoReporitory()

    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()

    expect(count).toBe(1)
  })
})
