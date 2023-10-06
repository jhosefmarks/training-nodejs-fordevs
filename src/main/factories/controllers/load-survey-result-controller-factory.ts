import { LoadSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeLogControllerDecorator, makeDbLoadSurveyResult, makeDbCheckSurveyById } from '@main/factories'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult())

  return makeLogControllerDecorator(controller)
}
