# Commits

All commits must follow the
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification syntax.
The `CHANGELOG.md` file is generated automatically using [Lerna](https://github.com/lerna/lerna)
that requires the commits to be in a specific format in order to be parsed.

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

```

### Type

The commit type part must be one defined by the
[Angular convention](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)

- **build**: Changes that affect the build system or external dependencies.
- **ci**: Changes to our CI configuration files and scripts.
- **chore**: Changes that you don’t want to appear in the changelog. For example, this can be used
  to fix the changelog if any release goes wrong.
- **docs**: Documentation only changes.
- **feat**: A new feature. New components, services, utilities…
- **fix**: A bug fix, or a hotfix
- **perf**: A code change that improves performance.
- **refactor**: An internal code change that neither fixes a bug nor adds a feature while keeping
  the same public API of the affected parts.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc).
- **test**: Adding missing tests or correcting existing tests. Every new feature must have its own
  test, so if you are adding a new component with its tests, the type should be **feat**, not
  **test**.

### Optional scope

The scope is optional. If a change affects the whole project, i.e. changing Prettier rules, you do
not need to add a scope that says “all the project”. This part must only be added if the change
affects a specific part of the code.

The scope is used to group the related changes in the changelog, so you can easily see all the
changes that have been done to an specific part of the library.

If you don’t know what scope your commit should have, probably you should do multiple commits.

As a starting point, this project uses the following scopes:

- **components**: changes that affect components that do not depend on any X Module.
- X Modules: If the change only affects one X Module, use the name of the module in `kebab-case`:
  - **device**
  - **empathize**
  - **extra-params**
  - **facets**
  - **history-queries**
  - **identifier-results**
  - **next-queries**
  - **popular-searches**
  - **queries-preview**
  - **query-suggestions**
  - **recommendations**
  - **related-tags**
  - **scroll**
  - **search**
  - **search-box**
  - **tagging**
  - **url**
- **x-plugin**: For changes that affect the core of the `x-components` project. For example, if you
  modify the X Components plugin, the X Components archetype, or the X bus.
- **wiring**: Changes that only affect the wiring operators or wiring factory.
- **e2e**: For end-to-end tests.
- **design-system**: For design tokens, CSS styling, etc.
- **deps**: For upgrading and change dependencies.

### Description

The description is a short sentence written in **present tense** with an **imperative mood**. The
description must explain the intention of the change at a high level. You don’t have to give details
on how or why the change has been done; just tell what the change is about.

> added `Dropdown` component ❌ The message uses past tense

> add `Dropdown` component so it can be reused in the `SortDropdown` component that will be done in
> another PR ❌ Too specific

> adds `Dropdown` component ❌ Does not use imperative mood

> add `Dropdown` component ✅ Just perfect!

### Optional body

If a simple description is not enough to describe the change, you give more details in the body of
the commit. The body is optional. Remember that the purpose of using this commit format is to
automate changelog generation.

This changelog is read by all users of the library, so keep the level of details low. Users want to
know how upgrading a version will affect their project, but they don’t care about internal or
private changes.

```
The `Dropdown` component serves as a replacement for the standard HTML `select` component. It exposes the same API to set the values and selected values. In addition, it also allows you to configure the animation to open and close the dropdown, and determine how each item is rendered.
```

### Optional footer

The footer can contain two parts: a [breaking changes](#breaking-changes) section, and an
[issue](#issue) section.

#### Breaking changes

This footer must be prefixed with `BREAKING CHANGE:`. After that, you can write a brief description
of what the breaking change is, and what the users should do to their codebases to support the
change.

```
BREAKING CHANGE: Rename `BaseEventsButton` to `EventsButton`.
```

```
BREAKING CHANGE: Rename `BaseFilter` component to `Filter`, and move it from `components` to the `facets` module. Now it can be imported like this: `import { Filter } from '@empathyco/x-components/facets'`.
```

#### Issue

To properly link the commit with the issue ID, add it to the end of the commit footer. The changelog
includes a link to the task so users can read more about the motivation of the change.

```
EX-1234
```

### Examples of valid commits

Minimal commit

```
style: switch from tabs to spaces

EX-1234
```

Commit with scope

```
perf(search): improve performance of grid item position calculation

EX-4567
```

Commit with breaking changes

```
feat(facets): backend filters no longer keep their own `selected` status.

BREAKING CHANGE: backend filters now trust the API selected value. The adapter must not map valid `filter.selected` values.

EX-1111
```
