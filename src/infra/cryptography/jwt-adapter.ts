import jwt from 'jsonwebtoken'

import { Decrypter, Encrypter } from '@data/protocols'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: jwt.Secret) {}

  async encrypt (plaintext: string): Promise<string> {
    const accessToken = jwt.sign({ id: plaintext }, this.secret)

    return accessToken
  }

  async decrypt (ciphertext: string): Promise<string> {
    const value: any = jwt.verify(ciphertext, this.secret)

    return value
  }
}
