import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { Express } from 'express'

import { MongoHelper } from '@infra/db/mongodb'

import { setupApp } from '@main/config/app'
import env from '@main/config/env'

let surveyCollection: Collection
let accountCollection: Collection
let app: Express

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

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()

    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const makeQuery = (surveyId): string => `query {
      surveyResult (surveyId: "${surveyId}") {
        surveyId
        date
        question
        answers {
          image
          answer
          count
          percent
          isCurrentAccountAnswer
        }
      }
    }`

    test('Should return SurveyResult', async () => {
      const now = new Date()
      const accessToken = await mockAccessToken()
      const surveyResult = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query: makeQuery(surveyResult.insertedId.toHexString()) })

      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe('Question')
      expect(res.body.data.surveyResult.date).toBe(now.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: 'Answer 1',
        image: 'http://image-name.com',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }, {
        answer: 'Answer 2',
        image: null,
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyResult = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      const res = await request(app)
        .post('/graphql')
        .send({ query: makeQuery(surveyResult.insertedId.toHexString()) })

      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const makeQuery = (surveyId, answer): string => `mutation {
      saveSurveyResult (surveyId: "${surveyId}", answer: "${answer}") {
        question
        answers {
          answer
          count
          percent
          isCurrentAccountAnswer
        }
        date
      }
    }`

    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()
      const surveyResult = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query: makeQuery(surveyResult.insertedId.toHexString(), 'Answer 1') })

      expect(res.status).toBe(200)
      expect(res.body.data.saveSurveyResult.question).toBe('Question')
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isCurrentAccountAnswer: true
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }])
    })
  })
})
