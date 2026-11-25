---
name: x-design-system
description: 'Tailwind CSS v4 design system for Empathy X interfaces (@empathyco/x-design-system): utility classes prefixed with xds: for buttons, badges, inputs, tags, tabs, suggestions, facets, sliding panels, progress bars and layout, plus theme variables (--xds-color-*, --xds-text-*, --xds-radius-*). Use when styling X search UI with xds: classes, choosing button or tab variants, theming colors, or debugging xds: classes that do not apply.'
---

# @empathyco/x-design-system

CSS-only package built on **Tailwind CSS v4**. Every utility uses the `xds:` prefix
(`@import 'tailwindcss' prefix(xds)`), so the consuming project must process the CSS with
Tailwind v4.

## Setup

Import the built CSS in the stylesheet that Tailwind processes:

```css
@import '@empathyco/x-design-system';
```

## Classes

Components are utilities combined on the same element: a base class plus size, shape and
color modifiers.

- Button: `xds:button` + size (`xds:button-sm`, `xds:button-md`, `xds:button-lg`,
  `xds:button-xl`) + shape (`xds:button-outlined`, `xds:button-ghost`, `xds:button-tight`,
  `xds:button-link`, `xds:button-circle`, `xds:button-square`) + color (`xds:button-accent`,
  `xds:button-lead`, `xds:button-neutral`, `xds:button-error`…). There are no
  `primary`/`secondary`/`tertiary` variants.
- Tabs: `xds:tabs` (`xds:tabs-vertical`, `xds:tabs-underline`, `xds:tabs-pill`,
  `xds:tabs-boxed`) containing `xds:tab` items (`xds:tab-sm`, `xds:tab-underline`…).
- Attach: anchors an element (for example a badge) to a corner of a container —
  `xds:attach-container` on the parent and `xds:attach-top-right` (or `-top-left`,
  `-bottom-left`, `-bottom-right`) on the child. Nothing to do with file attachments.
- Other families: badge, button-group, filter-facet, highlight, icon, input, input-group,
  layout, picture, progress-bar, scroll, sliding-panel, suggestion, suggestion-group, tag,
  typography. Read `node_modules/@empathyco/x-design-system/dist/components/<family>.css` for
  the exact class names.

Theme colors: neutral, lead, auxiliary, accent, highlight, success, warning, error.

## Variants

Custom variants: `xds:selected:…`, `xds:hover-active:…`, `xds:hover-active-focus:…`,
`xds:focus:…`, `xds:disabled:…`. Example: `xds:selected:button-accent`.

## Theme variables

The theme is exposed as CSS variables with the `xds` prefix, for example `--xds-color-*`,
`--xds-text-*` (font sizes), `--xds-radius-*`, `--xds-spacing-*`. Font sizes and radii are
not named font-size or border-radius.
