# Design Tokens

## What are Design Tokens?

Design Tokens it is a methodology to represent and code design decisions and use them directly in
your Design System. It is platform and language agnostic. If you are more interested, take a look to
these couple of articles:

- [CSS Tricks: What are Design Tokens](https://css-tricks.com/what-are-design-tokens/)
  [(Robin Rendle)](https://css-tricks.com/author/robinrendle/)
- [UX Design: Design Tokens for dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)
  [(Louis Chenais)](https://medium.com/@chuckn0risk)

## Design System

We are defining and using our own Design System. The Design Tokens will obey to the decisions taken
there. We can see a preview of this Design System
[here](https://app.zeplin.io/project/5f4e29bb7d2e170f478397de/styleguide) (⚠️ Work In Progress).

## Naming Design Tokens

Design Tokens naming is hard. There is no "standard" way to do it, and we have to adapt it to our
needs. To understand deeply different ways it can be done, please take a look to the following
article:

- [Medium: Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)
  [(Nathan Curtis)](https://medium.com/@nathanacurtis)

We are going to follow the next levels convention to name the tokens:

`[namespace]-[category]-[property]-[component]-[element]-[variant]-[state]-[scale]`

Examples: `--x-color-background-button-icon-filled-hover` `--x-font-size-xs`

⚠️ Not all levels are going to be used in every token. Only the needed, and we will increase the
tokens and its levels according to our needs.

### `[namespace]`

This level is to avoid collisions, specially using CSS custom properties (CSS variables) as tokens.
This level is mandatory, and we are always using `x-` as namespace prefix.

Example: `--x-color-background-filter`

### `[category]`

This level is to describe what kind of property is going to configure the token. We are going to use
the following categories:

- `color`
- `font`
- `border`
- `space`
- ...

Examples: `--x-color-text-input` `--x-color-background-button` `--x-font-size` `--x-border-radius`
`--x-space-margin-button`

### `[property]`

This level describes the property that the token is going to use. It can have multiple values
depending on the context:

- `text`
- `background`
- `radius`
- `width`
- ...

Examples: `--x-color-text-input` `--x-color-background-button` `--x-font-size` `--x-border-radius`
`--x-border-width` `--x-space-margin-button`

### `[component]`

This level defines the component that the token is going to affect. ⚠️ Don't confuse this component
with the X Components, or Vue Components. This is can be an abstraction, that can coincide or not
with a real Component.

- `button`
- `input`
- `input-group`
- `suggestion`
- `filter`
- ...

Examples: `--x-color-text-input` `--x-color-background-button` `--x-color-text-suggestion`
`--x-color-background-filter` `--x-color-background-input-group`

### `[element]`

This level is to describe if the token is used for an inner element of a component. For example the
icon inside a button.

Examples: `--x-color-background-button-icon` `--x-color-background-input-group-action-button`

### `[variant]`

This level is to describe the different variations we can have about a component.

Example: `--x-color-background-button-primary` `--x-color-background-button-secondary`
`--x-color-background-input-pill`

### `[state]`

This level is to describe different states a component can have. We don't have to define all the
possible states, only what we define on our Design System.

Example: `--x-color-background-button-hover` `--x-color-background-input-focus`

### `[scale]`

This level is to define a scale of values. Used specially in the base tokens.

Example: `--x-space-01` `--x-space-02` `--x-font-size-xs` `--x-font-size-s` `--x-font-weight-bold`
