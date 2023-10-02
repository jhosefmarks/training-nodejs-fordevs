import { Decrypter , Encrypter , HashComparer , Hasher } from '@data/protocols'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (plaintext: string): Promise<string> {
      return 'hashed_password'
    }
  }

  return new HasherStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (plaintext: string): Promise<string> {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (ciphertext: string): Promise<string> {
      return 'any_value'
    }
  }

  return new DecrypterStub()
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (plaintext: string, digest: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}
