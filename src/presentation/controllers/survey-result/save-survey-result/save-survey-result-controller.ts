import { forbidden, serverError } from '@presentation/helpers/http/http-helpers'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const answer = httpRequest.body.answer
      const surveyId = httpRequest.params.surveyId
      const accountId = httpRequest.accountId

      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const validAnswer = survey.answers.some(a => a.answer === answer)
      if (!validAnswer) {
        return forbidden(new InvalidParamError('answer'))
      }

      await this.saveSurveyResult.save({ surveyId, accountId, answer, date: new Date() })

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
