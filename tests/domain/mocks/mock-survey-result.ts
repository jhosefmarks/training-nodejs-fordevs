import { SurveyResultModel } from '@domain/models'
import { SaveSurveyResult } from '@domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: true
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: new Date()
})
