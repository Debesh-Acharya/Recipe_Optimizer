export default {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: [],
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'services/**/*.js',
    'routes/**/*.js',
    'models/**/*.js',
    'app.js',
    '!node_modules/**',
    '!coverage/**',
    '!tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};
