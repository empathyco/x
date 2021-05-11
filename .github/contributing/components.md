# Components

## Naming components

Multiple parts of the library uses similar patterns to provide components that are highly
customizable. These components must have similar names.

The Components defined as classes must be written in `PascalCase`:

```ts
// ❌ Wrong
@Component
export default class myComponent extends Vue {}

// ✅ Good
@Component
export default class MyComponent extends Vue {}
```

Its file name have to be written using `kebab-case`.

```
// ❌ Wrong
MyComponent.vue

// ✅ Good
my-component.vue
```

When a component is used in a template, the tag of the component is written in `PascalCase`:

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

The Base Components have no dependencies with any [X Module](./concepts.md#x-module). They serve as
a blocks to build more complex components. Base components must be prefixed with `Base`:
`PascalCase`.

```ts
// ❌ Wrong
@Component
export default class DefaultButton extends Vue {}

// ✅ Good
@Component
export default class BaseButton extends Vue {}
```

Its file name must be also prefixed using `kebab-case`.

```
// ❌ Wrong
button.vue

// ✅ Good
base-button.vue
```

### List components

Lists are across all app. These components just render a list of the same type of items. They can
have filtering functionality, but no more logic. Usually the item component can be replaced using
slots. List components must be suffixed with `List`.

```ts
// ❌ Wrong
@Component
export default class Suggestions extends Vue {}

// ✅ Good
@Component
export default class SuggsetionList extends Vue {}
```

Its file name must be also suffixed using `kebab-case`.

```
// ❌ Wrong
suggestions.vue

// ✅ Good
suggestion-list.vue
```

### Button components

These are components that are perceived as buttons by the User. It is not equivalent to use or not a
html `<button>` tag. There are components with `<button>` but they are displayed with the styles of
a `link`, for example.

The one to clear the search input, or the one to clear the selected filters are valid examples, but
if they represent an entity, the entity name should be used instead, like it happens with the
different type of suggestions (`NextQuery`, `PopularSearch`, `QuerySuggestion`...). Button
components be suffixed with `Button`.

```ts
// ❌ Wrong
@Component
export default class Clear extends Vue {}

// ✅ Good
@Component
export default class ClearButton extends Vue {}
```

Its file name must be also suffixed using `kebab-case`.

```
// ❌ Wrong
clear.vue

// ✅ Good
clear-button.vue
```

### Panel components

These are components that contain other components. Panel components must be suffixed with `Panel`.
They also and must be prefixed with `Base` if we are in a [Base Component](#base-components) case.

```ts
// ❌ Wrong
@Component
export default class SmartContainer extends Vue {}

// ✅ Good
@Component
export default class BaseSmartPanel extends Vue {}
```

Its file name must be also suffixed and/or prefixed using `kebab-case`.

```
// ❌ Wrong
smart-container.vue

// ✅ Good
base-smart-panel.vue
```

## Exports

The names of export must match with the name of component

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

## Naming Props

Props are how we pass variables and other information around between different component, its name
must be written in `camelCase` and follows the rules written in [Base-naming](base-naming.md).

### `alwaysVisible`

### `renderableFacets`

## Naming Vue events

### `<event>:<source>`

If a component can emit multiple types of events, like clicks depending on which subcomponent has
been clicked, for instance, name the events following the `<event>:<source>` convention in kebab
case. The `event` part is the name of the DOM event that triggered the Vue event, and the `source`
one the name of the element that triggered the event.

- `click:close`, `click:item`, `click:link`, `click:right-button`.

## Naming getters

Getters belong to x-modules. There are two different ways of declare a getter. It can be a function
or a class with multiple getters. If it is a function, it should be named using `camelCase` and
should explain what it is returning.

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

If it is a class, it should follow the [Classes](./base-naming.md#classes) convention, explain what
it is returning and be suffixed with `Getter`. Each function inside the class should explain what it
is doing or returning.

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

Its file name have to be written using `kebab-case` and be suffixed with `.getter`, (⚠️ pay
attention to the dot before `getter`)

```
// ❌ Wrong
selectedFilters.ts

// ✅ Good
selected-filters.getter.ts
```

## Common patterns

## Documentation

Components are written using [Markdown](https://daringfireball.net/projects/markdown/basics) and
[Vue Styleguidist](https://vue-styleguidist.github.io/docs/GettingStarted.html). This last library
is used only to extract the doc to Markdown.

### Links

It is mandatory to use [jsdoc tag](https://jsdoc.app/tags-inline-link.html) within JS/TS comments
wherever we can, including a readable link text.

`{@link namepathOrURL|link text}`

### Slots

It must be documented explaining what they are used for and if they have any value bound.

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

It must be documented explaining what they do, adding some context about how they achieve that. It
should be ended with `@public` to make it available to export it`

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
 * This component renders a history query suggestion combining two buttons: one for selecting this
 * suggestion as the search query, and another one to remove this query suggestion from the
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

It must be documented explaining what they do and adding extra information about how it is going to
be used. It should be ended with `@public` or `@internal` to be exported or not.

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

It must be documented explaining what they do and what they return. It should be ended with
`@returns` if it is returning something and with `@public` or `@internal` to be exported or not.

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
    return currencyFormatter(this.value, this.format, this.hideIntegerDecimals);
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
    return currencyFormatter(this.value, this.format, this.hideIntegerDecimals);
  }
}
```

### Component examples

Each component must have a documentation section where it is explained how that component will be
used, and the different uses that can be given to it.

It should have examples to show the `default`, `props` and `customized` usages.

```vue
<docs>
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

Each example should be explained with a brief description about what it is going to do and how it
will be done.

It renders a list of items using the default slot:

```vue
// ❌ Wrong ## Default usage Renders an string with the item id

<template>
  <BaseGrid :items="items">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>

// ✅ Good ## Default usage It renders a list of items using the default slot:

<template>
  <BaseGrid :items="items">
    <template #default="{ item }">
      {{ `Default slot content: ${item.id}` }}
    </template>
  </BaseGrid>
</template>
```


### Events

Each component must have an events section where it is explained what, how and when they are emitted.

Each event must be written following the next template:
 - -`EventName`: the event is emitted when...(something happend). The event payload is ...:

This approach is the same for the Vue events emitted by the component.
```vue
// ❌ Wrong

## Events

- The event is `UserClickedColumnPicker` and its emitted when the user clicks the component. The payload is
the column number.

// ✅ Good

## Events

- `UserClickedColumnPicker`: the event is emitted after the user clicks an item. The event payload
is the number of columns that the clicked item represents.

```

