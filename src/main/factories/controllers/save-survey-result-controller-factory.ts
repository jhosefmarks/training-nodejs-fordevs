import { SaveSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeDbSaveSurveyResult, makeLogControllerDecorator, makeDbLoadAnswersBySurvey } from '@main/factories'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())

  return makeLogControllerDecorator(controller)
}
