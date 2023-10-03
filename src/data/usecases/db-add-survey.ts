import { AddSurvey } from '@domain/usecases'

import { AddSurveyRepository } from '@data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyRepository) {}

  async add (data: AddSurvey.Params): Promise<void> {
    await this.addSurvey.add(data)
  }
}
