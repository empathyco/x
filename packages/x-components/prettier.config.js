import empathyPrettierConfig from '@empathyco/eslint-config/prettier'

export default {
  ...empathyPrettierConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './demo/tailwind/index.css',
}
