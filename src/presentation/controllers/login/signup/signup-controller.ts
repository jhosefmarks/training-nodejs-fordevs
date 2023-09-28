import { badRequest, serverError, ok, forbidden } from '@presentation/helpers/http/http-helpers'
import { EmailInUseError } from '@presentation/errors'
import {
  Controller,
  HttpResponse,
  HttpRequest,
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
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
      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({ email, password })

      return ok(authenticationModel)
    } catch (error) {
      console.error(error)

      return serverError(error)
    }
  }
}
