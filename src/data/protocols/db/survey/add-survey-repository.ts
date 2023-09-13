import { AddSurveyModel } from '@domain/usecases/survey/add-survey'

export interface AddSurveyReporitory {
  add: (surveyData: AddSurveyModel) => Promise<void>
}
