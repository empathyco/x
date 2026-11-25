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
  `left`/`right` are the inline start/end corners (mirrored in right-to-left).
- Other families: badge, button-group, filter-facet, highlight, icon, input, input-group,
  layout, picture, progress-bar, scroll, sliding-panel, suggestion, suggestion-group, tag,
  typography. Read `node_modules/@empathyco/x-design-system/dist/components/<family>.css` for
  the exact class names.

Theme colors: neutral, lead, auxiliary, accent, highlight, success, warning, error.

## Variants

Custom variants: `xds:selected:…`, `xds:hover-active:…`, `xds:hover-active-focus:…`,
`xds:focus:…`, `xds:disabled:…`. Example: `xds:selected:button-accent`.

## Direction (right-to-left)

Components follow the document direction (`dir="rtl"`). In the component families, `left`/`right`
mean the inline start/end edge and are mirrored in right-to-left (`attach-*`, `sliding-panel-button-*`,
`layout-*-margin-*`). Logical aliases exist for new code: `xds:sliding-panel-button-start/end`,
`xds:layout-no-margin-start/end`, `xds:layout-on-margin-start/end`, `xds:layout-container-ms/me-*`.

- Prefer the Tailwind logical utilities, also under the `xds:` prefix. They render exactly like
  the physical ones in left-to-right and are mirrored in right-to-left:

  | Physical (left-to-right only)       | Logical (both directions)           |
  | ----------------------------------- | ----------------------------------- |
  | `xds:ml-4` / `xds:mr-4`             | `xds:ms-4` / `xds:me-4`             |
  | `xds:pl-4` / `xds:pr-4`             | `xds:ps-4` / `xds:pe-4`             |
  | `xds:left-0` / `xds:right-0`        | `xds:start-0` / `xds:end-0`         |
  | `xds:border-l` / `xds:border-r`     | `xds:border-s` / `xds:border-e`     |
  | `xds:rounded-l` / `xds:rounded-r`   | `xds:rounded-s` / `xds:rounded-e`   |
  | `xds:rounded-tl` / `xds:rounded-tr` | `xds:rounded-ss` / `xds:rounded-se` |
  | `xds:rounded-bl` / `xds:rounded-br` | `xds:rounded-es` / `xds:rounded-ee` |
  | `xds:text-left` / `xds:text-right`  | `xds:text-start` / `xds:text-end`   |

- `xds:flip-rtl` mirrors direction-meaningful icons (chevrons, arrows) in right-to-left. Put it on
  an svg, an `inline-block` or a flex item (`scale` has no effect on plain inline text), and not
  together with `xds:scale-*` (both set `scale`).
- `xds:rtl:…` / `xds:ltr:…` variants for anything else.
- Set the direction with the `dir` attribute (`<html dir="rtl">`, or on the app root inside a shadow
  root), not only with the CSS `direction` property: the `rtl` variant follows `dir`, while the
  logical properties follow `direction`. Avoid `dir="ltr"` islands inside right-to-left pages for
  the mirrored components (the `rtl` variant also matches descendants of `[dir="rtl"]`).

## Theme variables

The theme is exposed as CSS variables with the `xds` prefix, for example `--xds-color-*`,
`--xds-text-*` (font sizes), `--xds-radius-*`, `--xds-spacing-*`. Font sizes and radii are
not named font-size or border-radius.
