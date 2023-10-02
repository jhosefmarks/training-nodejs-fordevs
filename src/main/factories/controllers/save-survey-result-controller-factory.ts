import { SaveSurveyResultController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeDbSaveSurveyResult, makeLogControllerDecorator, makeDbLoadSurveyById } from '@main/factories'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())

  return makeLogControllerDecorator(controller)
}
