module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    // '!<rootDir>/src/**/*-protocols.ts',
    // '!**/protocols/**',
    // '!**/*.d.ts',
    // '!<rootDir>/src/main/server.ts',
    // '!<rootDir>/src/main/config/env.ts',
    // '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@presentation/(.*)': '<rootDir>/src/presentation/$1',
    '@validation/(.*)': '<rootDir>/src/validation/$1',
    '@tests/(.*)': '<rootDir>/tests/$1'
  }
}
