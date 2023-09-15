import { AddSurvey, AddSurveyParams, AddSurveyReporitory } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyReporitory) {}

  async add (surveyData: AddSurveyParams): Promise<void> {
    await this.addSurvey.add(surveyData)
  }
}
