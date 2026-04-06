---
name: x-tailwindcss-skilld
description: TailwindCSS plugin for generating custom design systems with Interface X components
---

# X TailwindCSS - Empathy Design System Builder

## Overview

**@empathyco/x-tailwindcss** (also known as **XDS - X Design System**) is a TailwindCSS plugin that generates custom design systems for Interface X components. It brings design tokens, component styling, and theme customization to create consistent, branded search experiences.

**Key Features:**

- TailwindCSS plugin for design system generation
- Design token based configuration
- Component-level styling utilities
- Theme customization per customer/project
- Responsive and accessible defaults
- Works seamlessly with `@empathyco/x-components`

## Installation

```bash
npm install @empathyco/x-tailwindcss tailwindcss
```

**Peer dependency**: TailwindCSS 3.x

## Basic Setup

### TailwindCSS Configuration

```javascript
// tailwind.config.js
const xTailwindPlugin = require('@empathyco/x-tailwindcss')

module.exports = {
  content: ['./src/**/*.{vue,js,ts}', './node_modules/@empathyco/x-components/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [xTailwindPlugin()],
}
```

### With Custom Configuration

```javascript
const xTailwindPlugin = require('@empathyco/x-tailwindcss')

module.exports = {
  plugins: [
    xTailwindPlugin({
      // Design system configuration
      components: ['search-input', 'facets', 'results'],
      theme: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
        },
        spacing: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
        },
      },
    }),
  ],
}
```

## Design Tokens

### Color System

Define your color palette:

```javascript
xTailwindPlugin({
  theme: {
    colors: {
      // Brand colors
      primary: {
        50: '#e3f2fd',
        100: '#bbdefb',
        500: '#2196f3', // Main
        700: '#1976d2',
        900: '#0d47a1',
      },
      // Semantic colors
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      // Neutral
      gray: {
        100: '#f5f5f5',
        200: '#eeeeee',
        500: '#9e9e9e',
        900: '#212121',
      },
    },
  },
})
```

Usage in components:

```vue
<template>
  <div class="bg-primary-500 text-white">Search Result</div>
</template>
```

### Typography

Configure font families, sizes, and weights:

```javascript
xTailwindPlugin({
  theme: {
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
  },
})
```

### Spacing System

Define consistent spacing:

```javascript
xTailwindPlugin({
  theme: {
    spacing: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
      '2xl': '3rem', // 48px
    },
  },
})
```

### Breakpoints

Customize responsive breakpoints:

```javascript
xTailwindPlugin({
  theme: {
    screens: {
      mobile: '320px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    },
  },
})
```

## Component Styling

### Component-Specific Utilities

XDS generates utilities for X Components:

```javascript
xTailwindPlugin({
  components: {
    'search-input': {
      base: 'rounded-lg border-2 px-4 py-2',
      focus: 'ring-2 ring-primary-500',
      error: 'border-error',
    },
    'result-card': {
      base: 'bg-white shadow-sm rounded-md p-4',
      hover: 'shadow-lg',
    },
    facet: {
      base: 'mb-4',
      title: 'font-semibold text-lg mb-2',
      filter: 'flex items-center py-1',
    },
  },
})
```

### Using Component Classes

```vue
<template>
  <!-- Search Input -->
  <input class="x-search-input x-search-input-focus" />

  <!-- Result Card -->
  <div class="x-result-card hover:x-result-card-hover">
    <h3>Product Title</h3>
  </div>

  <!-- Facet -->
  <div class="x-facet">
    <h4 class="x-facet-title">Brand</h4>
    <label class="x-facet-filter"> <input type="checkbox" /> Nike </label>
  </div>
</template>
```

## Theme Customization

### Per-Customer Themes

Create unique themes for different customers:

```javascript
// customer-a-theme.js
module.exports = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
  },
  typography: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
}

// tailwind.config.js
const customerATheme = require('./customer-a-theme')

module.exports = {
  plugins: [
    xTailwindPlugin({
      theme: customerATheme,
    }),
  ],
}
```

### Dark Mode Support

```javascript
xTailwindPlugin({
  darkMode: 'class', // or 'media'
  theme: {
    colors: {
      light: {
        background: '#ffffff',
        text: '#000000',
      },
      dark: {
        background: '#1a1a1a',
        text: '#ffffff',
      },
    },
  },
})
```

Usage:

```vue
<template>
  <div class="bg-light-background dark:bg-dark-background">
    <p class="text-light-text dark:text-dark-text">Content</p>
  </div>
</template>
```

## Layout Utilities

### Grid Systems

```javascript
xTailwindPlugin({
  layouts: {
    'search-grid': {
      container: 'max-w-7xl mx-auto px-4',
      sidebar: 'w-64',
      main: 'flex-1',
      results: 'grid grid-cols-1 md:grid-cols-3 gap-4',
    },
  },
})
```

### Container Queries

```javascript
xTailwindPlugin({
  theme: {
    containers: {
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
    },
  },
})
```

## Animation & Transitions

### Custom Animations

```javascript
xTailwindPlugin({
  theme: {
    animations: {
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-up': {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
    animationDuration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
    },
  },
})
```

Usage:

```vue
<template>
  <div class="animate-fade-in duration-base">Fading in content</div>
</template>
```

## Responsive Design

### Mobile-First Approach

```vue
<template>
  <!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
  <div class="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
    <ResultCard v-for="result in results" :key="result.id" />
  </div>
</template>
```

### Custom Breakpoint Utilities

```javascript
xTailwindPlugin({
  theme: {
    screens: {
      mobile: '320px',
      tablet: { min: '768px' },
      desktop: { min: '1024px' },
      'desktop-large': { min: '1440px' },
      // Max-width queries
      'max-tablet': { max: '767px' },
    },
  },
})
```

## Accessibility Features

### Focus States

```javascript
xTailwindPlugin({
  accessibility: {
    focusRing: {
      width: '2px',
      color: 'primary-500',
      offset: '2px',
    },
    focusVisible: true,
  },
})
```

### Screen Reader Utilities

```vue
<template>
  <span class="sr-only">Search button</span>
  <button aria-label="Search">
    <SearchIcon />
  </button>
</template>
```

## Advanced Patterns

### Design Token Variables

Generate CSS custom properties:

```javascript
xTailwindPlugin({
  cssVariables: true,
  theme: {
    colors: {
      primary: '#007bff',
    },
  },
})
```

Generates:

```css
:root {
  --x-color-primary: #007bff;
}
```

### Component Variants

```javascript
xTailwindPlugin({
  components: {
    button: {
      base: 'px-4 py-2 rounded font-medium',
      variants: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-primary-500 text-primary-500',
      },
      sizes: {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
  },
})
```

### Conditional Styling

```vue
<template>
  <button
    class="x-button"
    :class="[`x-button-${variant}`, `x-button-${size}`, { 'x-button-disabled': disabled }]"
  >
    {{ label }}
  </button>
</template>
```

## Integration with X Components

### Complete Setup Example

```javascript
// tailwind.config.js
const xTailwindPlugin = require('@empathyco/x-tailwindcss')

module.exports = {
  content: ['./src/**/*.{vue,js,ts}', './node_modules/@empathyco/x-components/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#007bff',
          secondary: '#6c757d',
        },
      },
    },
  },
  plugins: [
    xTailwindPlugin({
      components: ['search-input', 'facets', 'results', 'pagination'],
      theme: {
        colors: {
          primary: '#007bff',
        },
        spacing: {
          md: '1rem',
        },
      },
    }),
  ],
}
```

```vue
<!-- App.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4">
    <SearchInput class="x-search-input mb-4" />
    <div class="grid grid-cols-4 gap-4">
      <Facets class="x-facets" />
      <Results class="col-span-3 x-results" />
    </div>
  </div>
</template>
```

## Build & Production

### Optimizing for Production

```javascript
// tailwind.config.js
module.exports = {
  // Purge unused styles
  content: ['./src/**/*.{vue,js,ts}', './node_modules/@empathyco/x-components/**/*.vue'],

  plugins: [xTailwindPlugin()],

  // Minimize output
  corePlugins: {
    preflight: true,
  },
}
```

### CSS Output Size

The plugin only generates classes you use. With PurgeCSS/JIT mode:

- Development: Full utilities available
- Production: Only used classes included

## Best Practices

1. **Use Design Tokens**: Define colors, spacing, typography in config, not hardcoded
2. **Component Classes**: Use semantic component classes instead of utility-only
3. **Responsive First**: Start mobile, enhance for larger screens
4. **Accessibility**: Always include focus states and ARIA labels
5. **Theme Consistency**: Keep theme configs in separate files per customer
6. **Test Dark Mode**: If supported, test both light and dark themes

## Common Issues

**Styles not applied**: Check `content` paths include X Components

**Purged classes**: Avoid dynamic class names, use safelist if needed

**Build size large**: Enable JIT mode and purge unused styles

**Theme not loading**: Verify plugin configuration syntax

**Conflicts with custom CSS**: Use `@layer` directive for custom styles

## Related Packages

- **@empathyco/x-components**: Vue components (this plugin styles them)
- **@empathyco/x-design-system**: Design tokens and themes
- **tailwindcss**: Required peer dependency

## Documentation & Resources

- **GitHub**: https://github.com/empathyco/x/tree/main/packages/x-tailwindcss
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Empathy Docs**: https://docs.empathy.co/

## Showcase

The package includes a `/showcase` directory with examples:

- Pre-built components
- Theme variations
- Responsive layouts
- Accessibility patterns

Check `/showcase` in the package for live examples.
