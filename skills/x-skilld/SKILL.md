---
name: x-skilld
description: Development guide for the Interface X monorepo - a Vue.js commerce search & discovery UI library
---

# Interface X Monorepo

## Overview

**Interface X** is a Vue.js-based commerce search & discovery UI library by Empathy.co. It provides standalone, configurable building blocks (X Components) for creating smooth, personalized search experiences in e-commerce shops.

**Key Facts:**
- **Primary Package**: `@empathyco/x-components` - Core package with Vue.js UI components
- **Technology Stack**: Vue 3, TypeScript, TailwindCSS, Vite, Vitest
- **Monorepo Management**: Lerna + pnpm + Nx
- **License**: Apache 2.0
- **Package Manager**: pnpm (v9.15.9+)
- **Node Requirements**: >=22

## Monorepo Structure

This is a Lerna-managed monorepo with independent versioning. All packages live in `packages/`:

### Core Packages
- **x-components** - Main UI component library (Vue.js based)
- **x-adapter** - Connects to any Search API via schemas
- **x-adapter-platform** - Platform-specific adapters
- **x-types** - TypeScript type definitions
- **x-utils** - Shared utilities

### Design & Styling
- **x-tailwindcss** - Design System Builder (XDS) - TailwindCSS plugin
- **x-design-system** - Design tokens and themes
- **x-svg-converter** - SVG optimization and conversion

### Supporting Packages
- **x-archetype-utils** - Archetype helper utilities
- **x-translations** - i18n translations
- **deep-merge** - Deep merge utilities
- **jest-utils** - Testing utilities
- **storage-service** - Browser storage abstraction

## Key Development Commands

### Installation & Setup
```bash
pnpm install --frozen-lockfile  # Install dependencies (required after clone)
```

### Build & Development
```bash
pnpm build          # Build all packages in monorepo
pnpm pack           # Pack all packages
pnpm serve          # Start dev servers for packages with serve scripts
```

### Code Quality
```bash
pnpm lint           # Lint all packages (with cache)
pnpm lint:check     # Lint check without fixes (CI mode)
pnpm format         # Format code with Prettier
pnpm format:check   # Check formatting without changes
pnpm typecheck      # Run TypeScript type checking
```

### Testing
```bash
pnpm test           # Run all tests
pnpm test:unit      # Run unit tests only
```

### Release & Publishing
```bash
pnpm prepare-release:stable  # Graduate prerelease packages to stable
pnpm release:alpha           # Publish alpha prerelease
pnpm publish-release         # Execute release workflow
```

## Lerna Commands

Lerna is used for managing the monorepo. Common patterns:

```bash
# Run command in specific package
lerna run build --scope=@empathyco/x-components

# Run command in all packages
lerna run test

# Version packages
lerna version --conventional-commits

# Publish packages
lerna publish
```

## Package Conventions

### Naming
- All packages follow the pattern: `@empathyco/x-*` or standalone names like `deep-merge`
- Scoped packages use `@empathyco/` namespace

### Configuration Files
Each package typically includes:
- `package.json` - Package metadata and scripts
- `tsconfig.json` - TypeScript configuration (often multiple: `.cjs.json`, `.esm.json`)
- `eslint.config.mjs` - ESLint configuration
- `vitest.config.ts` - Vitest test configuration
- `README.md` - Package documentation
- `CHANGELOG.md` - Version history

### Build Outputs
- Most packages build to `dist/` or `build/` directories
- TypeScript packages may use `temp/` for intermediate API reports
- API documentation generated in `report/` directories

## Commit Conventions

This project uses **Conventional Commits** with the following types:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style/formatting (not CSS)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Issue References**: Use `EX-` prefix for JIRA issues (e.g., `EX-1234`)

**Example commits:**
```
feat(x-components): add search box animation
fix(x-adapter): resolve timeout in API requests
docs(x-types): update TypeScript usage examples
```

## Key Technologies

### Frontend Framework
- **Vue 3**: Component-based reactive framework
- **TypeScript**: Strong typing throughout the project
- **Vite**: Build tool and dev server
- **Vitest**: Testing framework (compatible with Vite)

### Styling
- **TailwindCSS**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Design Tokens**: Custom design system via x-tailwindcss

### Code Quality
- **ESLint**: Linting (uses `@empathyco/eslint-config`)
- **Prettier**: Code formatting (configured via ESLint config)
- **Husky**: Git hooks for quality checks

### Testing
- **Vitest**: Unit and integration tests
- **Testing Library**: Component testing utilities

## Common Workflows

### Making Changes to a Package

1. Navigate to package: `cd packages/x-components`
2. Make code changes
3. Run tests: `pnpm test`
4. Run linter: `pnpm lint`
5. Build package: `pnpm build`
6. Test in consuming project if needed

### Adding a New Package

1. Create directory in `packages/`
2. Initialize with `package.json`
3. Add standard config files (tsconfig, eslint, etc.)
4. Update root `pnpm-workspace.yaml` if needed
5. Run `pnpm install` to link packages

### Working with Dependencies

- **Internal dependencies**: Automatically linked by pnpm workspace
- **External dependencies**: Add via `pnpm add <package>` in package directory
- **Shared dev dependencies**: Can be added to root `package.json`

### Running Package Scripts

```bash
# From root (runs in all packages)
pnpm build

# From package directory
cd packages/x-components
pnpm build

# Using Lerna to target specific packages
lerna run build --scope=@empathyco/x-components --scope=@empathyco/x-types
```

## Important Files

- `lerna.json` - Lerna configuration (independent versioning)
- `pnpm-workspace.yaml` - pnpm workspace configuration
- `nx.json` - Nx build caching configuration
- `package.json` - Root package scripts and shared dependencies
- `.github/CONTRIBUTING.md` - Contributing guidelines
- `renovate.json` - Automated dependency updates config

## Documentation

- **Product Docs**: https://docs.empathy.co/
- **Architecture**: https://docs.empathy.co/develop-empathy-platform/build-search-ui/web-x-architecture/
- **Component Reference**: https://docs.empathy.co/develop-empathy-platform/ui-reference/
- **GitHub Repo**: https://github.com/empathyco/x

## Key Patterns

### Component Architecture
- Components are standalone and independent
- Designed to work together but add value individually
- Built on Vue 3 Composition API
- Reactive state management via Vuex stores

### API Adapters
- `x-adapter` provides schema-based API connection
- Supports Empathy Search API, Elasticsearch, Solr, and custom APIs
- Extensible adapter pattern for custom integrations

### Design System
- XDS (X Design System) via `x-tailwindcss`
- Generates custom design systems per customer
- Based on design tokens and Tailwind plugin architecture

## Troubleshooting

### Common Issues

**Module not found errors**:
- Run `pnpm install` in root to re-link packages
- Check `pnpm-workspace.yaml` includes the package

**Build failures**:
- Ensure dependencies built first: `pnpm build`
- Check TypeScript errors: `pnpm typecheck`
- Clear caches: remove `node_modules/.cache` and `.nx` directories

**Test failures**:
- Update snapshots if needed
- Check Vitest configuration in `vitest.config.ts`

**Linting errors**:
- Run `pnpm lint` to auto-fix
- Check ESLint config extends `@empathyco/eslint-config`

## Project Philosophy

Interface X emphasizes:
- **Modularity**: Pick and choose components as needed
- **Interoperability**: Works with any search service
- **Customization**: Fully configurable layouts, styles, and behaviors
- **Developer Experience**: Easy integration and intuitive API
- **Performance**: Optimized for production use
- **Accessibility**: Built with a11y best practices

## Note on Package Name

This monorepo is for "Interface X" by Empathy.co. The repository name is simply "x", but this should not be confused with the unrelated npm package "x@0.1.2". All published packages from this monorepo use the `@empathyco/x-*` namespace or specific names like `deep-merge`.
