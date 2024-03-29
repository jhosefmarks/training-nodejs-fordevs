import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { Express } from 'express'

import { MongoHelper } from '@infra/db/mongodb'

import { setupApp } from '@main/config/app'
import env from '@main/config/env'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Jose',
    email: 'jose@mail.com',
    password: '123',
    role: 'admin'
  })
  const accessToken = sign({ id: res.insertedId.toHexString() }, env.jwtSecret)

  await accountCollection.updateOne({ _id: res.insertedId }, { $set: { accessToken } })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    app = await setupApp()

    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com/image.jpg',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey success', async () => {
      const accessToken = await mockAccessToken()

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com/image.jpg',
            answer: 'Answer 1'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await mockAccessToken()

      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })

    test('Should return 204 on load a empty list surveys with valid accessToken', async () => {
      const accessToken = await mockAccessToken()

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
