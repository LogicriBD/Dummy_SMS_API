/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/test/Init.ts'],
  testTimeout: 90000000,
}
