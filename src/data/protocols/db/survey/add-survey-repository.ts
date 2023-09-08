import { AddSurveyModel } from '@domain/usecases/add-survey'

export interface AddSurveyReporitory {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
