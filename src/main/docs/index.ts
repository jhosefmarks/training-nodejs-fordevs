import { loginPath, signUpPath, surveyPath } from './paths'
import { badRequest, serverError, unauthorized, notFound, forbidden } from './components'
import { accountSchema, addSurveyParamsSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, signUpParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas'

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
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    addSurveyParams: addSurveyParamsSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    signUpParams: signUpParamsSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}
