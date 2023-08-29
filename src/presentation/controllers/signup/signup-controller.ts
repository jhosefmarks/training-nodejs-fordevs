import { Controller, HttpResponse, HttpRequest, AddAccount, Validation } from './signup-controller-protocols'

import { badRequest, serverError, ok } from '../../helpers/http/http-helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const { name, email, password } = body

      const error = this.validation.validate(body)
      if (error) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      console.error(error)

      return serverError(error)
    }
  }
}
