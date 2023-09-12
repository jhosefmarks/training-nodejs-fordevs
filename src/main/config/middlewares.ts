import { Express } from 'express'

import { cors, contentType, bodyParser } from '@main/middlewares'

export default (app: Express): void => {
  app.use(cors)
  app.use(contentType)
  app.use(bodyParser)
}
