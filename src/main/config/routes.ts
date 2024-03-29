import { readdirSync } from 'fs'
import path from 'path'

import { Express, Router } from 'express'

export default (app: Express): void => {
  const router = Router()

  app.use('/api', router)

  readdirSync(path.join(__dirname, '/../routes')).map(async (file: string) => {
    if (!file.includes('.test.') && !file.endsWith('.map')) {
      (await import(path.join('../routes/', file))).default(router)
    }
  })
}
