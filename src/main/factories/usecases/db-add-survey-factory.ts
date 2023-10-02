import { DbAddSurvey } from '@data/usecases'
import { AddSurvey } from '@domain/usecases'
import { SurveyMongoRepository } from '@infra/db/mongodb'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoReporitory = new SurveyMongoRepository()

  return new DbAddSurvey(surveyMongoReporitory)
}
