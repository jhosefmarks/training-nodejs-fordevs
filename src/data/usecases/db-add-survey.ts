import { AddSurvey, AddSurveyParams } from '@domain/usecases'

import { AddSurveyReporitory } from '@data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyReporitory) {}

  async add (surveyData: AddSurveyParams): Promise<void> {
    await this.addSurvey.add(surveyData)
  }
}
