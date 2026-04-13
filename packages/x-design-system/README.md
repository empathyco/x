# @empathyco/x-design-system

> Empathy X Tailwind Design System

[![Version](https://img.shields.io/npm/v/@empathyco/x-design-system)](https://www.npmjs.com/package/@empathyco/x-design-system)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

A comprehensive Tailwind CSS-based design system for building consistent and accessible Empathy X interfaces. This package deprecates the **x-tailwindcss** package.

## 📋 Table of Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [Installation](#-installation)
- [Usage](#-usage)
- [Components](#-components)
- [Theme](#-theme)
- [Development](#-development)
- [Scripts](#-scripts)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🎨 **Prefixed Design System**: All utilities are prefixed with `xds:` to avoid conflicts
- 🧩 **18 Pre-built Components**: Ready-to-use styled components for common UI patterns
- 🎯 **Custom Theme**: Comprehensive color palette, typography, and spacing system
- 📦 **Zero Config**: Import and start using immediately
- 🔧 **Tailwind CSS v4**: Built on the latest Tailwind CSS
- 🚀 **TypeScript Support**: Full TypeScript declarations included
- 📱 **Responsive**: Mobile-first responsive design utilities
- ♿ **Accessible**: Built with accessibility best practices

## 📦 Requirements

- **Node.js**: >= 22
- **Tailwind CSS**: 4.x
- **Package Manager**: pnpm (recommended), npm, or yarn

## 🚀 Installation

```bash
# Using pnpm (recommended)
pnpm add @empathyco/x-design-system

# Using npm
npm install @empathyco/x-design-system

# Using yarn
yarn add @empathyco/x-design-system
```

## 💻 Usage

### Basic Setup

Import the design system in your main CSS file:

```css
@import '../../node_modules/@empathyco/x-design-system/dist/index.css';
```

This will include all components, theme, and utility variants with the `xds:` prefix.

### Using Components

Apply design system classes using the `xds:` prefix:

```html
<!-- Button -->
<button class="xds:button-primary xds:button">Click me</button>

<!-- Badge -->
<span class="xds:badge xds:badge-accent"> New </span>

<!-- Input -->
<input type="text" class="xds:input" placeholder="Search..." />
```

### Using Theme Variables

Access theme variables directly in your CSS:

```css
.custom-element {
  color: var(--xds-color-accent-50);
  border-radius: var(--xds-border-radius-md);
  font-size: var(--xds-font-size-base);
}
```

## 🧩 Components

The design system includes the following pre-styled components:

| Component            | Description                                    |
| -------------------- | ---------------------------------------------- |
| **Button**           | Primary, secondary, and tertiary button styles |
| **Button Group**     | Grouped button layouts                         |
| **Badge**            | Status and notification badges                 |
| **Input**            | Text input field styles                        |
| **Input Group**      | Grouped input layouts                          |
| **Tag**              | Removable tags and chips                       |
| **Icon**             | Icon container and sizing                      |
| **Picture**          | Responsive image component                     |
| **Typography**       | Heading and text styles                        |
| **Highlight**        | Text highlighting styles                       |
| **Suggestion**       | Search suggestion items                        |
| **Suggestion Group** | Grouped suggestions                            |
| **Filter Facet**     | Filtering UI components                        |
| **Progress Bar**     | Loading and progress indicators                |
| **Scroll**           | Custom scrollbar styles                        |
| **Sliding Panel**    | Side panel and drawer                          |
| **Attach**           | File attachment styles                         |
| **Layout**           | Grid and container layouts                     |

## 🎨 Theme

### Color Palette

The design system provides a comprehensive color system:

- **Neutral**: `neutral-0` to `neutral-100` (grays and whites)
- **Lead**: `lead-25`, `lead-50`, `lead-75`
- **Auxiliary**: `auxiliary-25`, `auxiliary-50`, `auxiliary-75`
- **Accent**: `accent-25`, `accent-50`, `accent-75`
- **Highlight**: `highlight-25`, `highlight-50`, `highlight-75`
- **Semantic Colors**: `success`, `warning`, `error`

### Border Radius

- `none`, `xs` (2px), `sm` (4px), `md` (8px), `lg` (16px), `xl` (32px), `full`

### Spacing & Typography

Custom spacing, font sizes, line heights, and font families are defined in the theme.

## 🛠️ Development

### Prerequisites

```bash
# Install dependencies
pnpm install
```

### Available Scripts

```bash
# Start development server with demo
pnpm dev

# Build library for production
pnpm build:lib

# Build demo application
pnpm build:demo

# Build both library and demo
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint          # Fix lint issues
pnpm lint:check    # Check for issues
pnpm lint:inspect  # Inspect ESLint config

# Formatting
pnpm format        # Format all files
pnpm format:check  # Check formatting

# Preview built demo
pnpm preview

# Create package tarball
pnpm pack
```

### Demo Development

The package includes a Vue 3 demo application to preview all components:

```bash
pnpm dev
```

Navigate to the provided localhost URL to view the component showcase.

## 📁 Project Structure

```
x-design-system/
├── lib/                    # Source CSS files
│   ├── components/         # Component styles (18 components)
│   ├── components.css      # Component imports
│   ├── theme.css          # Design tokens and variables
│   ├── variants.css       # Utility variants
│   └── index.css          # Main entry point
├── demo/                   # Vue demo application
├── build/                  # Build scripts
├── scripts/               # Utility scripts
├── dist/                  # Built distribution (generated)
├── package.json
└── README.md
```

## 🔧 Technologies

- **[Tailwind CSS 4.2](https://tailwindcss.com/)**: Core design system framework
- **[Vue 3](https://vuejs.org/)**: Demo application framework
- **[Vite 7](https://vitejs.dev/)**: Build tool and dev server
- **[TypeScript 5](https://www.typescriptlang.org/)**: Type safety
- **[@tailwindcss/vite](https://tailwindcss.com/docs/installation/vite)**: Vite integration
- **ESLint & Prettier**: Code quality and formatting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Run `pnpm lint` and `pnpm format` before committing
- Ensure `pnpm typecheck` passes
- Add or update tests as necessary
- Update documentation for any API changes

## 📄 License

Copyright © 2026 Empathy Systems Corporation S.L.

Licensed under the [Apache License 2.0](LICENSE).

## 🔗 Links

- [GitHub Repository](https://github.com/empathyco/x)
- [Package on npm](https://www.npmjs.com/package/@empathyco/x-design-system)
- [Report Issues](https://github.com/empathyco/x/issues)
- [Empathy.co](https://empathy.co)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

Made with ❤️ by [Empathy](https://empathy.co)
