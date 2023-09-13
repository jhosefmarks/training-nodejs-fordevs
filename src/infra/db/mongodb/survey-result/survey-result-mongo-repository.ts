import { ObjectId } from 'mongodb'

import { SaveSurveyResultRepository } from '@data/protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from '@domain/models/survey-result'
import { SaveSurveyResultModel } from '@domain/usecases/save-survey-result'

import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId)
      }, {
        $set: {
          answer: data.answer,
          data: data.date
        }
      }, {
        upsert: true,
        returnDocument: 'after'
      }
    )

    return res.value && MongoHelper.map(res.value)
  }
}
