import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: {
      core: './src/index.ts',
      'device/index': './src/x-modules/device',
      'empathize/index': './src/x-modules/empathize',
      'experience-controls/index': './src/x-modules/experience-controls',
      'extra-params/index': './src/x-modules/extra-params',
      'facets/index': './src/x-modules/facets',
      'history-queries/index': './src/x-modules/history-queries',
      'identifier-results/index': './src/x-modules/identifier-results',
      'next-queries/index': './src/x-modules/next-queries',
      'popular-searches/index': './src/x-modules/popular-searches',
      'queries-preview/index': './src/x-modules/queries-preview',
      'query-suggestions/index': './src/x-modules/query-suggestions',
      'recommendations/index': './src/x-modules/recommendations',
      'related-prompts/index': './src/x-modules/related-prompts',
      'related-tags/index': './src/x-modules/related-tags',
      'scroll/index': './src/x-modules/scroll',
      'search/index': './src/x-modules/search',
      'search-box/index': './src/x-modules/search-box',
      'semantic-queries/index': './src/x-modules/semantic-queries',
      'tagging/index': './src/x-modules/tagging',
      'url/index': './src/x-modules/url',
      'x-modules.types/index': './src/x-modules/x-modules.types',
    },
    //formats: ['es'],
    minify: true,
    sourcemap: true,
    platform: 'neutral',
    fromVite: true,
    dts: false,
    exports: {
      all: true,
    },
  },
])
