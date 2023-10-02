import { Collection } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'

import { MongoHelper } from '@infra/db/mongodb'
import app from '@main/config/app'
import env from '@main/config/env'

describe('Login Routes', () => {
  let accountCollection: Collection

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

    test('Should return 403 on sigup if email is already in use', async () => {
      await accountCollection.insertOne({
        name: 'Jose',
        email: 'jose@mail.com',
        password: '123'
      })

      await request(app)
        .post('/api/signup')
        .send({
          name: 'Jose',
          email: 'jose@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(403)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Jose',
        email: 'jose@mail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'jose@mail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid_email@mail.com',
          password: 'invalid_password'
        })
        .expect(401)
    })
  })
})
