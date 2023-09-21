import { loginPath, signUpPath, surveyPath, surveyResultPath } from './paths'
import { badRequest, serverError, unauthorized, notFound, forbidden } from './components'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, saveSurveyParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveyResultSchema, surveySchema, surveysSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node API',
    description: 'API de treinamento para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'MIT',
    url: 'https://raw.githubusercontent.com/jhosefmarks/training-nodejs-fordevs/main/LICENSE'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    addSurveyParams: addSurveyParamsSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    signUpParams: signUpParamsSchema,
    surveyAnswer: surveyAnswerSchema,
    surveyResult: surveyResultSchema,
    survey: surveySchema,
    surveys: surveysSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    forbidden,
    notFound,
    serverError,
    unauthorized
  }
}
