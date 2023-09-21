import { mockSurveyModel, mockSurveyResultModel } from '@domain/test'

import { SurveyResultModel } from '@domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@domain/usecases/survey-result/save-survey-result'
import { LoadSurveyById } from '@domain/usecases/survey/load-survey-by-id'
import { SurveyModel } from '@domain/models/survey'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdStub()
}
