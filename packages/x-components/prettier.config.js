import empathyPrettierConfig from '@empathyco/eslint-config/prettier'

export default {
  ...empathyPrettierConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/tailwind/xds.css',
}
