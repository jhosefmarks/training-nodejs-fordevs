import { mockSurveyModels, mockSurveyModel } from '@tests/domain/mocks'

import { AddSurveyParams } from '@domain/usecases'
import { SurveyModel } from '@domain/models'

import { AddSurveyReporitory , LoadSurveyByIdRepository , LoadSurveysRepository } from '@data/protocols'

export const mockAddSurveyRepository = (): AddSurveyReporitory => {
  class AddSurveyReporitoryStub implements AddSurveyReporitory {
    async add (surveyData: AddSurveyParams): Promise<void> { }
  }

  return new AddSurveyReporitoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysRepositoryStub()
}
