import { Express } from 'express'

import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'
import { bodyParser } from '../middlewares/body-parser'

export default (app: Express): void => {
  app.use(cors)
  app.use(contentType)
  app.use(bodyParser)
}
