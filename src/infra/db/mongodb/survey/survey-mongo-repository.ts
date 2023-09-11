import { AddSurveyReporitory } from '@data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import { AddSurveyModel } from '@domain/usecases/add-survey'
import { SurveyModel } from '@domain/models/survey'

import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyReporitory, LoadSurveysRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys && MongoHelper.mapCollection(surveys)
  }
}
