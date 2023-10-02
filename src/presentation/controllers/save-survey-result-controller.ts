import { LoadSurveyById, SaveSurveyResult } from '@domain/usecases'

import { forbidden, ok, serverError } from '@presentation/helpers'
import { InvalidParamError } from '@presentation/errors'
import { Controller, HttpResponse } from '@presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { answer, surveyId, accountId } = request

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

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
