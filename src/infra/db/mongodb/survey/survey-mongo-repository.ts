import { AddSurveyReporitory } from '@data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '@domain/usecases/add-survey'

import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyReporitory {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
