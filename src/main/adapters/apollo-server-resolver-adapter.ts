import { GraphQLError } from 'graphql'
import { Controller } from '@presentation/protocols'

export const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = {
    ...(args || {}),
    accountId: context?.req?.accountId
  }
  const httpResponse = await controller.handle(request)

  if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
    return httpResponse.body
  } else {
    throw new GraphQLError(httpResponse.body.message, { extensions: { code: httpResponse.statusCode } })
  }
}
