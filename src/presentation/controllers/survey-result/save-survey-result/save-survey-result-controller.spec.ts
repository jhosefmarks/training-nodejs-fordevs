import MockDate from 'mockdate'

import { InvalidParamError, ServerError } from '@presentation/errors'
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SurveyModel,
  SurveyResultModel
} from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult())
    }
  }

  return new SaveSurveyResultStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return { sut, loadSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('answer'))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(makeFakeRequest())

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(makeFakeSurveyResult())
  })
})
