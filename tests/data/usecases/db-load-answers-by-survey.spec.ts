import { mockSurveyAnswers, mockSurveyModel } from '@tests/domain/mocks'
import { mockLoadAnswersBySurveyRepository } from '@tests/data/mocks'

import { LoadAnswersBySurveyRepository } from '@data/protocols'
import { DbLoadAnswersBySurvey } from '@data/usecases'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositoryStub: LoadAnswersBySurveyRepository
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositoryStub)

  return { sut, loadAnswersBySurveyRepositoryStub }
}

describe('DbLoadAnswersBySurvey', () => {
  test('Should call LoadAnswersBySurveyRepository', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers')

    await sut.loadAnswers('any_id')

    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    mockSurveyModel()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual(mockSurveyAnswers())
  })

  test('Should return empty array if LoadAnswersBySurveyRepository returns null', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockResolvedValueOnce([])

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  })

  test('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    jest.spyOn(loadAnswersBySurveyRepositoryStub, 'loadAnswers').mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
