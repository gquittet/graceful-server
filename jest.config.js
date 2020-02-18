module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      diagnostics: true
    }
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
