import { mockSurveyModels, mockSurveyModel } from '@tests/domain/mocks'

import { SurveyModel } from '@domain/models'

import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository
} from '@data/protocols'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyRepository.Params): Promise<void> { }
  }

  return new AddSurveyRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
      return true
    }
  }

  return new CheckSurveyByIdRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
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
