import { Controller, Validation, HttpRequest, HttpResponse, Authentication } from './login-protocols'

import { badRequest, serverError, unauthorized, ok } from '../../helpers/http/http-helpers'

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

      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      console.error(error)

      return serverError(error)
    }
  }
}
