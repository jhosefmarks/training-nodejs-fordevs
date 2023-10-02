import MockDate from 'mockdate'

import { mockAddSurveyRepository } from '@tests/data/mocks'
import { mockAddSurveyParams } from '@tests/domain/mocks'

import { AddSurveyParams } from '@domain/usecases'

import { AddSurveyReporitory } from '@data/protocols'
import { DbAddSurvey } from '@data/usecases'

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
