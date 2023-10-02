import { LoadSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeLogControllerDecorator, makeDbLoadSurveyResult, makeDbLoadSurveyById } from '@main/factories'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())

  return makeLogControllerDecorator(controller)
}
