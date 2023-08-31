import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapters'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router
    .post('/signup', adaptRoute(makeSignUpController()))
    .post('/login', adaptRoute(makeLoginController()))
}
