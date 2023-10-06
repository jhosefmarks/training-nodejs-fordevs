import { throwError } from '@tests/domain/mocks'
import { mockCheckSurveyByIdRepository } from '@tests/data/mocks'

import { CheckSurveyByIdRepository } from '@data/protocols'
import { DbCheckSurveyById } from '@data/usecases'

type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositoryStub: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositoryStub = mockCheckSurveyByIdRepository()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositoryStub)

  return { sut, checkSurveyByIdRepositoryStub }
}

const surveyId = 'any_id'

describe('DbLoadSurveyById', () => {
  test('Should call CheckSurveyByIdRepository', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById')

    await sut.checkById(surveyId)

    expect(checkByIdSpy).toHaveBeenCalledWith(surveyId)
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()

    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(true)
  })

  test('Should return false if CheckSurveyByIdRepository returns false', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockResolvedValueOnce(false)

    const exists = await sut.checkById(surveyId)

    expect(exists).toBe(false)
  })

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(checkSurveyByIdRepositoryStub, 'checkById').mockImplementationOnce(throwError)

    const promise = sut.checkById(surveyId)

    await expect(promise).rejects.toThrow()
  })
})
