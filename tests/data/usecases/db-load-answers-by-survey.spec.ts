import { mockLoadSurveyByIdRepository } from '@tests/data/mocks'
import { mockSurveyAnswers, mockSurveyModel } from '@tests/domain/mocks'

import { LoadSurveyByIdRepository } from '@data/protocols'
import { DbLoadAnswersBySurvey } from '@data/usecases'

type SutTypes = {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositoryStub)

  return { sut, loadSurveyByIdRepositoryStub }
}

describe('DbLoadAnswersBySurvey', () => {


  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadAnswers('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return answers on success', async () => {
    const { sut } = makeSut()
    mockSurveyModel()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual(mockSurveyAnswers())
  })

  test('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null)

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([])
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
