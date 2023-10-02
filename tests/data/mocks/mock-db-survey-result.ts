import { mockSurveyResultModel } from '@tests/domain/mocks'

import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResultParams } from '@domain/usecases'

import { SaveSurveyResultRepository , LoadSurveyResultRepository } from '@data/protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<void> { }
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new LoadSurveyResultRepositoryStub()
}
