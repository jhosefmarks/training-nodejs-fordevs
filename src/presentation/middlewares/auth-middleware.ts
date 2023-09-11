import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccessDeniedError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Middleware } from '@presentation/protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)

        if (account) {
          return ok({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
