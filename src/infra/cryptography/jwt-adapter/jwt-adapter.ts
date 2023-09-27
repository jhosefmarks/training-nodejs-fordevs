import jwt from 'jsonwebtoken'

import { Encrypter } from '@data/protocols/cryptography/encrypter'
import { Decrypter } from '@data/protocols/cryptography/decrypter'

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
