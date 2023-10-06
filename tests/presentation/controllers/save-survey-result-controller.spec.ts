import MockDate from 'mockdate'

import { mockSurveyResultModel } from '@tests/domain/mocks'
import { mockLoadAnswersBySurvey, mockSaveSurveyResult } from '@tests/presentation/mocks'

import { LoadAnswersBySurvey, SaveSurveyResult } from '@domain/usecases'

import { SaveSurveyResultController } from '@presentation/controllers'
import { InvalidParamError, ServerError } from '@presentation/errors'

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveyStub: LoadAnswersBySurvey
  saveSurveyResultStub: SaveSurveyResult
}

const mockRequest = (): SaveSurveyResultController.Request => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer'
})

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)

  return { sut, loadAnswersBySurveyStub, saveSurveyResultStub }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers')

    await sut.handle(mockRequest())

    expect(loadAnswersSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadAnswersBySurvey returns empty array', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockResolvedValueOnce([])

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('surveyId'))
  })

  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyStub, 'loadAnswers').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'wrong_answer'
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new InvalidParamError('answer'))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(mockRequest())

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

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockSurveyResultModel())
  })
})
