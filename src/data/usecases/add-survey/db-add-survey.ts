import { AddSurvey, AddSurveyModel, AddSurveyReporitory } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurvey: AddSurveyReporitory) {}

  async add (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurvey.add(surveyData)
  }
}
