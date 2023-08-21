import { Controller, EmailValidator, HttpResponse, HttpRequest, AddAccount, Validation } from './signup-protocols'

import { InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { body } = httpRequest
      const { name, email, password } = body

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      console.error(error)

      return serverError(error)
    }
  }
}
