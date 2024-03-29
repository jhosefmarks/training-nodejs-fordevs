import { GraphQLSchema , GraphQLError } from 'graphql'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

import { makeAuthMiddleware } from '@main/factories'

export const AuthDirective = (schema: GraphQLSchema): GraphQLSchema =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')

      if (authDirective) {
        const { resolve } = fieldConfig

        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            accessToken: context?.req?.headers?.['x-access-token']
          }

          const httpResponse = await makeAuthMiddleware().handle(request)

          if (httpResponse.statusCode === 200) {
            Object.assign(context?.req, httpResponse.body)

            return resolve.call(this, parent, args, context, info)
          } else {
            throw new GraphQLError(httpResponse.body.message, { extensions: { code: httpResponse.statusCode } })
          }
        }
      }

      return fieldConfig
    }
  })
