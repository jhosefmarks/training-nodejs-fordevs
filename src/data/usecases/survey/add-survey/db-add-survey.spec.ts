import MockDate from 'mockdate'

import { AddSurveyParams, AddSurveyReporitory } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyReporitoryStub: AddSurveyReporitory
}

const makeFakeSurveyData = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeAddSurveyReporitory = (): AddSurveyReporitory => {
  class AddSurveyReporitoryStub implements AddSurveyReporitory {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyReporitoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyReporitoryStub = makeAddSurveyReporitory()
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
    const surveyData: AddSurveyParams = makeFakeSurveyData()

    await sut.add(surveyData)

    expect(addSpy).toBeCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyReporitoryStub } = makeSut()
    jest.spyOn(addSurveyReporitoryStub, 'add').mockRejectedValueOnce(new Error())
    const surveyData: AddSurveyParams = makeFakeSurveyData()

    const promise = sut.add(surveyData)

    await expect(promise).rejects.toThrow()
  })
})
