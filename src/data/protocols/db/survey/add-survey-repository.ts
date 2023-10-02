import { AddSurveyParams } from '@domain/usecases'

export interface AddSurveyReporitory {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
