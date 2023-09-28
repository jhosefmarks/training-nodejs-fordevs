import { Collection, ObjectId } from 'mongodb'

import { mockAddAccountParams, mockAddSurveyParams } from '@domain/test'

import { AccountModel } from '@domain/models/account'
import env from '@main/config/env'

import { MongoHelper } from '@infra/db/mongodb/helpers'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())

  const account = await accountCollection.findOne({ _id: res.insertedId })

  return MongoHelper.map(account)
}

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.diconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should add a survey on add success', async () => {
      const sut = makeSut()

      await sut.add(mockAddSurveyParams())

      const survey = await surveyCollection.findOne({ question: 'any_question' })

      expect(survey).toBeTruthy()
      expect(survey.question).toBe('any_question')
      expect(survey.answers[0].image).toBe('any_image')
      expect(survey.answers[0].answer).toBe('any_answer')
      expect(survey.answers[1].image).toBe('other_image')
      expect(survey.answers[1].answer).toBe('other_answer')
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const account = await mockAccount()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      const survey = await surveyCollection.findOne({ _id: result.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      })
      const sut = makeSut()

      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe('any_question')
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load empty list', async () => {
      const account = await mockAccount()
      const sut = makeSut()

      const surveys = await sut.loadAll(account.id)

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()

      const survey = await sut.loadById(res.insertedId.toHexString())

      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})
