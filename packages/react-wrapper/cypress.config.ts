import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
    specPattern: 'tests/e2e/specs/**/*.spec.ts',
    supportFile: 'tests/e2e/support/index.ts',
    video: false
  }
});
