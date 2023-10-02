import { HashComparer, Hasher } from '@data/protocols'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) { }

  async hash (plaintext: string): Promise<string> {
    const hash = await bcrypt.hash(plaintext, this.salt)

    return hash
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)

    return isValid
  }
}
