import { AddSurveyParams } from '@domain/usecases/survey/add-survey'

export interface AddSurveyReporitory {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
