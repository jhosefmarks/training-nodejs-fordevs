import { LoadSurveyById, SaveSurveyResult } from '@domain/usecases'

import { forbidden, ok, serverError } from '@presentation/helpers'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'

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

      const surveyResult = await this.saveSurveyResult.save({ surveyId, accountId, answer, date: new Date() })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
