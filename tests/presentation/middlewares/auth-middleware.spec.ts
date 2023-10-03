import { makeLoadAccountByToken } from '@tests/presentation/mocks'

import { LoadAccountByToken } from '@domain/usecases'

import { AccessDeniedError, ServerError } from '@presentation/errors'
import { AuthMiddleware } from '@presentation/middlewares'
import { HttpResponse } from '@presentation/protocols'

type sutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeFakeRequest = (): AuthMiddleware.Request => ({ accessToken: 'any_token' })

const makeSut = (role?: string): sutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const request = {}

    const httpResponse: HttpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const request = makeFakeRequest()

    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accountId: 'any_id' })
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })
})
