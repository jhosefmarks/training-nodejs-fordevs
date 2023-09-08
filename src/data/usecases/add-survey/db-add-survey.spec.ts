import { AddSurveyModel, AddSurveyReporitory } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyReporitoryStub: AddSurveyReporitory
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

const makeAddSurveyReporitory = (): AddSurveyReporitory => {
  class AddSurveyReporitoryStub implements AddSurveyReporitory {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyReporitoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyReporitoryStub = makeAddSurveyReporitory()
  const sut = new DbAddSurvey(addSurveyReporitoryStub)

  return { sut, addSurveyReporitoryStub }
}

describe('DBAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyReporitoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyReporitoryStub, 'add')
    const surveyData: AddSurveyModel = makeFakeSurveyData()

    await sut.add(surveyData)

    expect(addSpy).toBeCalledWith(surveyData)
  })
})
