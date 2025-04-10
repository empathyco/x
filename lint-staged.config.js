/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{ts,tsx,vue}": (_stagedFiles) => [
    "pnpm run format:check",
    "pnpm run lint:check"
  ],
  "*.{md,js,json}": (stagedFiles) => [
    "pnpm run format:check"
  ],
}