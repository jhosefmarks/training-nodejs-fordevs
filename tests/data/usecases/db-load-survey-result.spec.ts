import MockDate from 'mockdate'

import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@tests/data/mocks'
import { mockEmptySurveyResultModel, mockSurveyResultModel, throwError } from '@tests/domain/mocks'

import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@data/protocols'
import { DbLoadSurveyResult } from '@data/usecases'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub)

  return { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id', 'account_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'account_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)

    const promise = sut.load('any_survey_id', 'account_id')

    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)

    await sut.load('any_survey_id', 'account_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null)

    const surveyResult = await sut.load('any_survey_id', 'account_id')

    expect(surveyResult).toEqual(mockEmptySurveyResultModel())
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.load('any_survey_id', 'account_id')

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
