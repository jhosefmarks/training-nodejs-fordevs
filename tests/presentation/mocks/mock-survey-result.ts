import { mockSurveyResultModel } from '@tests/domain/mocks'

import { LoadSurveyResult , SaveSurveyResult } from '@domain/usecases'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
      return mockSurveyResultModel()
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<LoadSurveyResult.Result> {
      return mockSurveyResultModel()
    }
  }

  return new LoadSurveyResultStub()
}
