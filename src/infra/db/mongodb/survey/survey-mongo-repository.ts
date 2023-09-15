import { ObjectId } from 'mongodb'

import { AddSurveyReporitory } from '@data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '@data/protocols/db/survey/load-surveys-repository'
import { LoadSurveyByIdRepository } from '@data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'
import { AddSurveyParams } from '@domain/usecases/survey/add-survey'
import { SurveyModel } from '@domain/models/survey'

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyReporitory, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys && MongoHelper.mapCollection(surveys)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey && MongoHelper.map(survey)
  }
}
