import { SaveSurveyResult } from '@domain/usecases'

import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@data/protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(data)

    return this.loadSurveyResultRepository.loadBySurveyId(data.surveyId, data.accountId)
  }
}
