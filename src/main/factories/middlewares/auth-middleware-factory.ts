import { Middleware } from '@presentation/protocols'
import { AuthMiddleware } from '@presentation/middlewares'

import { makeDbLoadAccountByToken } from '@main/factories'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const dbLoadAccountByToken = makeDbLoadAccountByToken()

  return new AuthMiddleware(dbLoadAccountByToken, role)
}
