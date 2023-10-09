import { mockSurveyAnswers, mockSurveyModels } from '@tests/domain/mocks'

import { AddSurvey , CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@domain/usecases'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> { }
  }

  return new AddSurveyStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return true
    }
  }

  return new CheckSurveyByIdStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<LoadSurveys.Result> {
      return mockSurveyModels()
    }
  }

  return new LoadSurveysStub()
}

export const mockLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveyStub implements LoadAnswersBySurvey {
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
      return mockSurveyAnswers()
    }
  }

  return new LoadAnswersBySurveyStub()
}
