# Design System

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

Examples: `--x-color-background-button-icon-filled-hover` `--x-size-font-button`

⚠️ Not all levels are going to be used in every token. Only the needed, and we will increase the
tokens and its levels according to our needs.

⚠️ We are going to use the [Style Dictionary](https://amzn.github.io/style-dictionary) tool to
generate the tokens from JSON files. So we have to be careful with the naming of the tokens. The
main issue to avoid is to have tokens names that start with other token name.

Example (❌  DON'T DO THIS): `--x-color-button` `--x-color-button-primary`

This is a problem when the tokens are stored as JSON. To avoid this we have to add the `-default`
variant to the default tokens:

Example: `--x-color-button-default` `--x-color-button-primary`

### `[namespace]`

This level is to avoid collisions, specially using CSS custom properties (CSS variables) as tokens.
This level is mandatory, and we are always using `x-` as namespace prefix.

Example: `--x-color-background-filter`

### `[category]`

This level is to describe what kind of property is going to configure the token. This is important
because it will be used to determine how to format the token value for the different platforms. We
are going to use the following categories:

- `color`: For the color values (#FFAABB, lightblue, etc.).
- `size`: For any value with size units (px, em, %, etc).
- `number`: For any number value (font-weight, etc).
- `font`: For the font family.
- `time`: For animations times.
- `string`: For any other token value that doesn't fit in previous categories.

Examples: `--x-color-text-input` `--x-color-background-button` `--x-font-family-text`
`--x-size-border-radius` `--x-size-margin-button`

### `[property]`

This level describes the css property that the token is going to use. It can have multiple values
depending on the context:

- `font-weight`
- `line-height`
- `background`
- `border-radius`
- `width`
- ...

Examples: `--x-color-text-input` `--x-color-background-button` `--x-size-font`
`--x-size-border-radius` `--x-size-border-width` `--x-size-margin-button`

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

⚠️ As mentioned before, it is important to not repeat a token name as the beginning of other token
name. To avoid that the `-default`  variant will be added for the default tokens:

Example: `--x-color-button-default` `--x-color-button-primary`


### `[state]`

This level is to describe different states a component can have. We don't have to define all the
possible states, only what we define on our Design System.

Example: `--x-color-background-button-hover` `--x-color-background-input-focus`

### `[scale]`

This level is to define a scale of values. Used specially in the base tokens.

Example: `--x-size-base-01` `--x--size-base-02` `--x-size-font-base-xs` `--x-size-font-base-s`
`--x-number-font-weight-bold`

## Tokens Architecture

The idea of the Design Tokens is not just add a variable for each property, but also add relations
between those tokens, so that changes made in one token also affects to the dependant tokens.

Let's show this with an example. There are Design Tokens to define the background color and the
border color of the different buttons.

- Base Color Token:

  `--x-color-base-lead: #36515b;`

- Button Component Token:

  `--x-color-background-button: var(--x-color-base-lead);`

  `--x-color-border-button: var(--x-color-background-button);`

- Button Component Variation Token:

  `--x-color-background-button-secondary: transparent;`

  `--x-color-border-button-secondary: var(--x-color-border-button);`

As you can see, there are tokens using other tokens as value. This is a relation between Design
Tokens. Making those tokens depending on the others we can make changes with the granularity we
need:

- If we change the value of `--x-color-base-lead` token, then all the components besides the
  buttons, will be affected.

- If we change the value of `--x-color-background-button` the color of all the buttons and its
  variations will change, but the rest of the components will keep using the `--x-color-base-lead`.

- If we change the value of `--x-color-background-button-secondary` then only that variation of the
  button will be affected.

Also, as you can see some tokens may depend on other property, like the button border color, and the
button background color. This is to cascade changes only change one property.

If the button border color is always the same as the background, then it refers to id by default.
This still allow to configure a different border color if is necessary, just overriding the value of
that token.

## Design System Files Structure

### `src/design-system`

All the tokens and styles of the Design System are located in the `src/design-system` directory.

### `src/design-system/base`

Inside this directory are the base tokens shared by the all the components. The name of a file
tokens have this shape: `name.tokens.scss`. The `.tokens.` suffix is mandatory.

### `src/design-system/components`

Inside this directory are a folder for each component of the Design System (do not confuse with Vue
components). Inside each component folder there are all the CSS files and tokens files for that
component.

The name of the tokens files have this shape: `name.tokens.scss` where `name` is the name of the
component variant. The `.tokens.` suffix is mandatory.

The default css and tokens of a component must be named as `default.scss` and `default.tokens.scss`.

## Design System Build

During the build process, all the files of the Design System (`src/design-system`) are processed,
and the output files are generated in the `dist/css` folder.

This process is divided in 4 steps:

#### 1. Design System Components.

All the files in `src/design-system/components` are processed, merging together the `xxxx.scss` and
`xxxx.tokens.scss` files of each component variant. These generated files will have a name with the
shape `component-variant.css`, where `component` is the name of the component (the folder), and the
`variant` is the name of the variant (the file). Example: `button/default.scss` +
`button/deafult.tokens.scss` ==> `button-default.css`

#### 2. Base Tokens.

All the files in `src/design-system/base` are processed and merged together into one file
`base.css`. This contains the base tokens on which depend the rest of the components.

#### 3. Default Theme

All the files in `src/design-system/base` and all the `default` variants of each component, are
merged together in a `default-theme.css` file. This will contain the tokens and CSS necessary for
all the default variant of the components.

#### 4. Full Theme

All the files in `src/design-system` are merged together in a `full-theme.css` file. This will
contain all the Design System Tokens and Components.

### Why all this CSS files?

The idea behind of this division and repetition, is to offer granularity and flexibility enough to
the user of the Design System:

- If the user wants all the Design System without worrying about the size, then he can import
  `full-theme.css`.

- If the user wants only the default styles of the components and maybe some variants, then he can
  import `default-theme.scss` + the desire variants like `button-pill.css`.

- If the user wants to control exactly what components and what variants to import, then he can
  import the `base.css` + the desire components + the desire variants.

  Example: `base.css` + `button-default.css` + `button-card.css`.
