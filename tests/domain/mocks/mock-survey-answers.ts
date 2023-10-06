import { LoadAnswersBySurvey } from '@domain/usecases'

export const mockSurveyAnswers = (): LoadAnswersBySurvey.Result => ([
  'any_answer',
  'other_answer'
])
