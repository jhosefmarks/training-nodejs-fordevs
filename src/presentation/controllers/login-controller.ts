import { Authentication } from '@domain/usecases'

import { badRequest, serverError, unauthorized, ok } from '@presentation/helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@presentation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { email, password } = body

      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const authenticationModel = await this.authentication.auth({ email, password })

      if (!authenticationModel) {
        return unauthorized()
      }

      return ok(authenticationModel)
    } catch (error) {
      console.error(error)

      return serverError(error)
    }
  }
}
