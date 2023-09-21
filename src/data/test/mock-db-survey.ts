import { mockSurveyModels, mockSurveyModel } from '@domain/test'

import { AddSurveyParams } from '@domain/usecases/survey/add-survey'

import { AddSurveyReporitory } from '@data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@domain/models/survey'
import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'

export const mockAddSurveyRepository = (): AddSurveyReporitory => {
  class AddSurveyReporitoryStub implements AddSurveyReporitory {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyReporitoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return new Promise(resolve => { resolve(mockSurveyModels()) })
    }
  }

  return new LoadSurveysRepositoryStub()
}
