# Components

## Naming components

Multiple parts of the library use similar patterns to provide components that are highly
customizable. These components must have similar names. The components defined as classes must be
written in `PascalCase`.

```ts
// ❌ Wrong
@Component
export default class myComponent extends Vue {}

// ✅ Good
@Component
export default class MyComponent extends Vue {}
```

The file name must be written using `kebab-case`.

```
// ❌ Wrong
MyComponent.vue

// ✅ Good
my-component.vue
```

When a component is used in a template, the tag of the component must be written in `PascalCase`.

```vue
// ❌ Wrong
<template>
  <section>
    <my-component class="x-component" />
  </section>
</template>

// ✅ Good
<template>
  <section>
    <MyComponent class="x-component" />
  </section>
</template>
```

### Base components

The base components have no dependencies with any [X Module](./concepts.md#x-module). They serve as
blocks to build more complex components. Base components must be prefixed with `Base` using
`PascalCase`.

```ts
// ❌ Wrong
@Component
export default class DefaultButton extends Vue {}

// ✅ Good
@Component
export default class BaseButton extends Vue {}
```

The file name must be also prefixed using `kebab-case`.

```
// ❌ Wrong
button.vue

// ✅ Good
base-button.vue
```

### List components

Lists components are used across all apps. These components render a list of the same type of items.
They can have filtering functionality, but do not contain additional logic. Usually, the item
component can be replaced using slots. List components must be suffixed with `List`.

```ts
// ❌ Wrong
@Component
export default class Suggestions extends Vue {}

// ✅ Good
@Component
export default class SuggestionList extends Vue {}
```

The file name must be also suffixed using `kebab-case`.

```
// ❌ Wrong
suggestions.vue

// ✅ Good
suggestion-list.vue
```

### Button components

These components are perceived by the User as buttons. They are not the same as an HTML `<button>`
tag. There are components with `<button>` that are displayed with `link` style, for example. Valid
examples include the button used to clear the search input or the button to clear the selected
filters. If the button represents an entity, the entity name should be used instead. For example,
with different types of suggestions (`NextQuery`, `PopularSearch`, `QuerySuggestion`...).

Button components must be suffixed with `Button`.

```ts
// ❌ Wrong
@Component
export default class Clear extends Vue {}

// ✅ Good
@Component
export default class ClearButton extends Vue {}
```

The file name must be suffixed using `kebab-case`.

```
// ❌ Wrong
clear.vue

// ✅ Good
clear-button.vue
```

### Panel components

These components contain other components. Panel components must be suffixed with `Panel`. They must
be prefixed with `Base` if they are a [Base Component](#base-components).

```ts
// ❌ Wrong
@Component
export default class SmartContainer extends Vue {}

// ✅ Good
@Component
export default class BaseSmartPanel extends Vue {}
```

The file name must be suffixed and/or prefixed as appropriate using `kebab-case`.

```
// ❌ Wrong
smart-container.vue

// ✅ Good
base-smart-panel.vue
```

## Exports

The names of exports must match the name of the component.

```ts
// ❌ Wrong
index.ts;
export { default as Filter } from './filters/base-filter.vue';

base - filter.vue;
@Component
export default class BaseFilter extends Vue {}

// ✅ Good
index.ts;
export { default as BaseFilter } from './filters/base-filter.vue';

base - filter.vue;
@Component
export default class BaseFilter extends Vue {}
```

## Naming props

Props are used to pass variables and other information around between different components. The name
must be written in `camelCase` and must follow the rules written in [Base-naming](base-naming.md).

### `alwaysVisible`

### `renderableFacets`

## Naming Vue events

### `<event>:<source>`

If a component can emit multiple types of events, such as clicks depending on the subcomponent
clicked, you must name the events according to the `<event>:<source>` convention in `kebab` case.
`event` represents the name of the DOM event that triggered the Vue event, and `source` represents
the name of the element that triggered the event.

- `click:close`, `click:item`, `click:link`, `click:right-button`.

## Naming getters

Getters belong to [X Module](./concepts.md#x-module). There are two different ways of declaring a
getter. It can be a **function** or a **class** with multiple getters. If the getter is a
**function**, it should be named using `camelCase`. It should explain what it returns.

```ts
// ❌ Wrong
export const queryRequest: SearchXStoreModule['getters']['queryRequest'] = ({ query }) => {
  return {
    query,
    start: 0,
    origin: 'default'
  };
};

// ✅ Good
export const request: SearchXStoreModule['getters']['request'] = ({ query }) => {
  return {
    query,
    start: 0,
    origin: 'default'
  };
};
```

If the getter is a **class**, it should follow the [Classes](./base-naming.md#classes) convention,
explain what it returns, and be suffixed with `Getter`. Each function inside the class should
explain what it does or returns.

```ts
// ❌ Wrong
export class historyGetter implements GettersClass<HistoryQueriesXStoreModule> {
  historyQueries({ query, historyQueries, config }: HistoryQueriesState): HistoryQuery[] {
    return historyQueries;
  }
}

// ✅ Good
export class HistoryQueriesGetter implements GettersClass<HistoryQueriesXStoreModule> {
  historyQueries({ query, historyQueries, config }: HistoryQueriesState): HistoryQuery[] {
    return historyQueries;
  }
}
```

The file name must be written using `kebab-case` and be suffixed with `.getter`. IMPORTANT: Pay
attention to the period before `getter`.

```
// ❌ Wrong
selectedFilters.ts

// ✅ Good
selected-filters.getter.ts
```

## Documentation

Components are documented using [Markdown](https://daringfireball.net/projects/markdown/basics) and
[Vue Styleguidist](https://vue-styleguidist.github.io/docs/GettingStarted.html). The Vue
Styleguidist library is used to export the doc to Markdown.

### Links

You must use [jsdoc tag](https://jsdoc.app/tags-inline-link.html) within JS/TS comments wherever you
can, including a readable link text.

`{@link namepathOrURL|link text}`

### Slots

Document slot by explaining what they are used for and if they have any bindings.

```vue
// ❌ Wrong
<template>
  <BaseSuggestion class="x-next-query" :suggestion="suggestion">
    <template #default="{ suggestion }">
      <!--
        @slot Next Query content.
      -->
      <slot :suggestion="suggestion">{{ suggestion.query }}</slot>
    </template>
  </BaseSuggestion>
</template>

// ✅ Good
<template>
  <BaseSuggestion class="x-next-query" :suggestion="suggestion">
    <template #default="{ suggestion }">
      <!--
        @slot Next Query content.
          @binding {Suggestion} suggestion - Next Query suggestion data.
      -->
      <slot :suggestion="suggestion">{{ suggestion.query }}</slot>
    </template>
  </BaseSuggestion>
</template>
```

### Component

Components must be documented by explaining what they do. You should add some context about how they
achieve that. You must end the inline documentation with `@public` to make it available for export
using Vue Styleguidist

```ts
// ❌ Wrong
/**
 * Renders a history queries.
 *
 * @internal
 */
@Component({
  mixins: [xComponentMixin(historyQueriesXModule)],
  components: { RemoveHistoryQuery, BaseSuggestion }
})
export default class HistoryQuery extends Vue {}

// ✅ Good
/**
 * This component renders a history query suggestion by combining two buttons: one for selecting this
 * suggestion as the search query, and another button to remove this query suggestion from the
 * history queries.
 *
 * @public
 */
@Component({
  mixins: [xComponentMixin(historyQueriesXModule)],
  components: { RemoveHistoryQuery, BaseSuggestion }
})
export default class HistoryQuery extends Vue {}
```

### Props

Document props by explaining what they do and add extra information about how they are used. End the
inline documentation with `@public` or `@internal`, depending on whether it needs to be exported or
not.

```ts
// ❌ Wrong
@Component
class Component {
  /**
   * An array.
   *
   * @public
   */
  @Prop()
  items?: Result[];
}

// ✅ Good
@Component
class Component {
  /**
   * The list of results to render.
   *
   * @public
   */
  @Prop()
  items?: Result[];
}
```

### Methods & computed

Document methods and computed by explaining what they do and what they return. Use `@returns` to
indicate what is returned, and end the inline documentation with `@public` or `@internal` depending
on whether it should be exported or not.

```ts
// ❌ Wrong
@Component
class CurrencyComponent {
  /**
   * Returns a string.
   *
   * @internal
   */
  protected get currency(): string {
    return currencyFormatter(this.value, this.format);
  }
}

// ✅ Good
@Component
class CurrencyComponent {
  /**
   * Returns the formatted result as string.
   *
   * @returns Formatted number.
   *
   * @internal
   */
  protected get currency(): string {
    return currencyFormatter(this.value, this.format);
  }
}
```

### Component examples

Each component must have a documentation block where you explain how the component is used and the
different uses.

It must contain examples to show the `default`, `props` and `customized` usages.

```vue
<docs lang="mdx">
# Example

## Default usage

## Prop 1

## Prop 2

## ...

## Customized usage

## Usage 1

## Usage 2

## ...
</docs>
```

Each example must be explained with a brief description about what it does and how it is done.

It renders a list of items using the default slot:

```vue
// ❌ Wrong
## Default usage

Renders an string with the item id

<template>
  <BaseGrid :items="items">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>

// ✅ Good
## Default usage

It renders a list of items using the default slot:

<template>
  <BaseGrid :items="items">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>
```

### Events

Each component must have an events documentation section that explains which events it emits, and
how and when they are emitted.

Each event must be written according to the format:

- -`EventName`: the event is emitted when...(something happened). The event payload is ...:

This approach is the same for the Vue events emitted by the component.

```vue
// ❌ Wrong
## Events

- The event is `UserClickedColumnPicker` and it is emitted when the user clicks the component. 
  The payload is the column number. 

// ✅ Good
## Events

- `UserClickedColumnPicker`: the event is emitted after the user clicks an item. 
  The event payload is the number of columns that the clicked item represents.
```
