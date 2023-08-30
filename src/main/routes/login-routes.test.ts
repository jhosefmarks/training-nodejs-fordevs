import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

import app from '../config/app'

import request from 'supertest'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.diconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on sigup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Jose',
          email: 'jose@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })
})
