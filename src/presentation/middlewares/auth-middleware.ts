import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Middleware } from '@presentation/protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']

    await this.loadAccountByToken.load(accessToken)

    return forbidden(new AccessDeniedError())
  }
}
