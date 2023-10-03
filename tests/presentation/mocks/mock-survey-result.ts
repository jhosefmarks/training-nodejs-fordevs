import { mockSurveyResultModel } from '@tests/domain/mocks'

import { SurveyResultModel } from '@domain/models/survey-result'
import { LoadSurveyResult } from '@domain/usecases/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases/save-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new LoadSurveyResultStub()
}
