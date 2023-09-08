import { AccessDeniedError } from '@presentation/errors'
import { HttpRequest, HttpResponse } from '@presentation/protocols'

import { AuthMiddleware } from './auth-middleware'

interface sutTypes {
  sut: AuthMiddleware
}

const makeSut = (): sutTypes => {
  const sut = new AuthMiddleware()

  return { sut }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      headers: { }
    }

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new AccessDeniedError())
  })
})
