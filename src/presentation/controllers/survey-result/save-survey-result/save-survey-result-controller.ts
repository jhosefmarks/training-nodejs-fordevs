import { forbidden, serverError } from '@presentation/helpers/http/http-helpers'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const validAnswer = survey.answers.some(a => a.answer === httpRequest.body.answer)
      if (!validAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
