module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
      tsConfig: 'tsconfig.json',
      diagnostics: true
    }
  },
  testRegex: '/__tests__/.*\\.test\\.ts',
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
