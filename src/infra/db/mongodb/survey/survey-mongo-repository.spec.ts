import { Collection } from 'mongodb'

import env from '@main/config/env'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.diconnect()
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

  test('Should add a survey on add success', async () => {
    const sut = makeSut()

    await sut.add({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer1'
        }, {
          answer: 'any_answer2'
        }
      ]
    })

    const survey = await surveyCollection.findOne({ question: 'any_question' })

    expect(survey).toBeTruthy()
    expect(survey.question).toBe('any_question')
    expect(survey.answers[0].image).toBe('any_image')
    expect(survey.answers[0].answer).toBe('any_answer1')
    expect(survey.answers[1].image).toBeUndefined()
    expect(survey.answers[1].answer).toBe('any_answer2')
  })
})
