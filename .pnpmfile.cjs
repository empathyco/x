/**
 * TypeScript 7 (native) no longer ships the JavaScript compiler API that many tools rely on.
 * The workspace packages use `typescript@7` for the `tsc` CLI, while these tools keep resolving
 * a nested TypeScript 6 (which still ships the JS API).
 */
const TOOLS_USING_TS_API = new Set([
  '@microsoft/api-extractor',
  '@microsoft/api-extractor-model',
  '@rushstack/node-core-library',
  '@rushstack/terminal',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  '@typescript-eslint/typescript-estree',
  '@typescript-eslint/type-utils',
  '@typescript-eslint/utils',
  '@typescript-eslint/project-service',
  '@typescript-eslint/tsconfig-utils',
  '@vue/language-core',
  '@vue/typescript-plugin',
  '@volar/typescript',
  'ts-api-utils',
  'ts-node',
  'rollup-plugin-typescript2',
  'typescript-eslint',
  'vite-plugin-dts',
  'vue-tsc',
])

function readPackage(pkg) {
  if (TOOLS_USING_TS_API.has(pkg.name)) {
    for (const field of ['peerDependencies', 'dependencies', 'devDependencies']) {
      if (pkg[field]) delete pkg[field].typescript
    }
    if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript
    pkg.dependencies = { ...pkg.dependencies, typescript: '6.0.3' }
  }
  return pkg
}

module.exports = { hooks: { readPackage } }
