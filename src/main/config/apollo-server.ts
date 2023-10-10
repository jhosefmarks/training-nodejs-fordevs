import { ApolloServer } from '@apollo/server'
import { GraphQLError } from 'graphql'

import resolvers from '@main/graphql/resolvers'
import typeDefs from '@main/graphql/type-defs'

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined
    response.http.status = error.extensions.code
  })
}

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => { handleErrors(response, errors) }
    })
  }]
})
