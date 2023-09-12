import { EmailInUseError, MissingParamError, ServerError } from '@presentation/errors'
import { SignUpController } from './signup-controller'
import {
  HttpResponse,
  HttpRequest,
  AccountModel,
  AddAccount,
  AddAccountModel,
  Validation,
  Authentication,
  AuthenticationModel
} from './signup-controller-protocols'

type SutTypes = {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthentication()

  const sut = new SignUpController(validationStub, addAccountStub, authenticationStub)

  return { sut, validationStub, addAccountStub, authenticationStub }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => Promise.reject(new Error()))

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValue(null)

    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token' })
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authetication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpRequest = makeFakeRequest()

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })
})
