import { AddSurveyController } from '@presentation/controllers'
import { Controller } from '@presentation/protocols'

import { makeAddSurveyValidation, makeDbAddSurvey, makeLogControllerDecorator } from '@main/factories'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())

  return makeLogControllerDecorator(addSurveyController)
}
