import MockDate from 'mockdate'

import { mockAddSurveyRepository } from '@data/test'
import { mockAddSurveyParams } from '@domain/test'

import { AddSurveyParams, AddSurveyReporitory } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyReporitoryStub: AddSurveyReporitory
}

const makeSut = (): SutTypes => {
  const addSurveyReporitoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyReporitoryStub)

  return { sut, addSurveyReporitoryStub }
}

describe('DBAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyReporitoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyReporitoryStub, 'add')
    const surveyData: AddSurveyParams = mockAddSurveyParams()

    await sut.add(surveyData)

    expect(addSpy).toBeCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyReporitoryStub } = makeSut()
    jest.spyOn(addSurveyReporitoryStub, 'add').mockRejectedValueOnce(new Error())
    const surveyData: AddSurveyParams = mockAddSurveyParams()

    const promise = sut.add(surveyData)

    await expect(promise).rejects.toThrow()
  })
})
