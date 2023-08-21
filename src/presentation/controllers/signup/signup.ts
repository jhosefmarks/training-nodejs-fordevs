import { Controller, EmailValidator, HttpResponse, HttpRequest, AddAccount, Validation } from './signup-protocols'

import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly validation: Validation,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      const { body } = httpRequest
      const { name, email, password, passwordConfirmation } = body

      for (const field of requiredFields) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

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
