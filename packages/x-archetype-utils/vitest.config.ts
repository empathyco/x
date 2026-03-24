import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      customExportConditions: ['node', 'node-addons'],
      html: '<html lang="en-US"></html>',
      url: 'https://empathy.co/',
      userAgent: 'Agent/007',
    },
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
