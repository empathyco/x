import { mergeConfig } from 'vitest/config'
import viteConfig from './demo/vite.config'

export default mergeConfig(viteConfig, {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
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
    setupFiles: ['./vitest-setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
