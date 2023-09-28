import MockDate from 'mockdate'

import { mockLoadSurveysRepository } from '@data/test'
import { mockSurveyModels } from '@domain/test'

import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await sut.load('any_id')

    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load('any_id')

    expect(surveys).toEqual(mockSurveyModels())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load('any_id')

    await expect(promise).rejects.toThrow()
  })
})
