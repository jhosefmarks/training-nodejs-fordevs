import MockDate from 'mockdate'

import { ServerError } from '@presentation/errors'

import { AddSurvey, AddSurveyModel, HttpRequest, HttpResponse, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new Error())
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
