import express, { Express } from 'express'
import { expressMiddleware } from '@apollo/server/express4'

import { setupApolloServer } from './apollo-server'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'
import setupSwagger from './swagger'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  const server = setupApolloServer()

  await server.start()

  app.use('/graphql', expressMiddleware(server))

  return app
}
