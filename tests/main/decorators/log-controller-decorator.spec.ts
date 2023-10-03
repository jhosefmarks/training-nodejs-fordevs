import { mockLogErrorRepository } from '@tests/data/mocks'

import { LogErrorRepository } from '@data/protocols'
import { serverError, ok } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'

import { LogControllerDecorator } from '@main/decorators'

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok('any_value')

      return httpResponse
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = 'any_value'

    await sut.handle(request)

    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const request = 'any_value'

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(ok('any_value'))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(mockServerError())
    const request = 'any_value'

    await sut.handle(request)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
