import { mockSurveyModels } from '@tests/domain/mocks'

import { SurveyModel } from '@domain/models/survey'
import { AddSurvey, AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { LoadSurveys } from '@domain/usecases/survey/load-surveys'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> { }
  }

  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysStub()
}
