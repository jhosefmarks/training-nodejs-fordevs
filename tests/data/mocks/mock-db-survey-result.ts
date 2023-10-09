import { mockSurveyResultModel } from '@tests/domain/mocks'

import { SaveSurveyResultRepository , LoadSurveyResultRepository } from '@data/protocols'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultRepository.Params): Promise<void> { }
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
      return mockSurveyResultModel()
    }
  }

  return new LoadSurveyResultRepositoryStub()
}
