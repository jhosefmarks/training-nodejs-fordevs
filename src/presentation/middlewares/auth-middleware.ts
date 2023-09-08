import { AccessDeniedError } from '@presentation/errors'
import { forbidden } from '@presentation/helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Middleware } from '@presentation/protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
