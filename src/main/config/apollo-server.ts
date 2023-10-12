import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { Express } from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLError } from 'graphql'

import { AuthDirective } from '@main/graphql/directives'
import resolvers from '@main/graphql/resolvers'
import typeDefs from '@main/graphql/type-defs'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    response.http.status = error.extensions.code
  })
}

const schema = AuthDirective(makeExecutableSchema({ resolvers, typeDefs }))

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    plugins: [{
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => { handleErrors(response, errors) }
      })
    }]
  })

  await server.start()

  app.use('/graphql', expressMiddleware(server, { context: async ({ req }) => ({ req }) }))
}
