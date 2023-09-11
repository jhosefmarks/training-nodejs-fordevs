import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapters'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptMiddleware } from '@main/adapters/express-middleware-adapters'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
