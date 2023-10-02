import { mockAddAccount, mockAuthentication, mockValidation } from '@tests/presentation/mocks'

import { AddAccount, Authentication } from '@domain/usecases'
import { SignUpController } from '@presentation/controllers'
import { EmailInUseError, MissingParamError, ServerError } from '@presentation/errors'
import { HttpResponse, Validation } from '@presentation/protocols'

type SutTypes = {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

const mockRequest = (): SignUpController.Request => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addAccountStub = mockAddAccount()
  const authenticationStub = mockAuthentication()

  const sut = new SignUpController(validationStub, addAccountStub, authenticationStub)

  return { sut, validationStub, addAccountStub, authenticationStub }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockRejectedValueOnce(new Error())

    const httpResponse: HttpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(mockRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 403 if AddAccount returns false', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValue(false)

    const httpResponse: HttpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual(new EmailInUseError())
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const request = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }

    const httpResponse: HttpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ accessToken: 'any_token', name: 'any_name' })
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('any_field'))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(mockRequest())

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authetication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const request = mockRequest()

    const httpResponse: HttpResponse = await sut.handle(request)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })
})
