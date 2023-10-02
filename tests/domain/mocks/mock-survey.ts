import { SurveyModel } from '@domain/models'
import { AddSurveyParams } from '@domain/usecases'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }, {
    answer: 'other_answer',
    image: 'other_image'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel =>
  ({ id: 'any_id', ...mockAddSurveyParams() })

export const mockSurveyModels = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      answer: 'other_answer',
      image: 'other_image'
    }],
    date: new Date()
  }]
}
