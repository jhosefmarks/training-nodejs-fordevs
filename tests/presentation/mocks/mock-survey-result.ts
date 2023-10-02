import { mockSurveyModel, mockSurveyResultModel } from '@tests/domain/mocks'

import { SurveyResultModel } from '@domain/models/survey-result'
import { LoadSurveyResult } from '@domain/usecases/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases/save-survey-result'
import { LoadSurveyById } from '@domain/usecases/load-survey-by-id'
import { SurveyModel } from '@domain/models/survey'

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

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdStub()
}
