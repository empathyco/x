# Naming

## Variables, attributes, and properties

These rules apply to any kind of variable, whether it is defined as an attribute, a class
property, an object property, or a Vue component prop.

- The name must be written in `camelCase`.

```ts
// ❌ Wrong
const search_box_query = 'beer';
const SearchBoxQuery = 'beer';

// ✅ Good
const searchBoxQuery = 'beer';
```

- Avoid adding words that do not add value.

```ts
// ❌ Wrong
const theQuery = 'beer';
const searchDebounceInMs = 100;
const urlForSearching = 'api.empathybroker.com';

// ✅ Good
const query = 'beer';
const searchDebounceMs = 100;
const searchingURL = 'api.empathybroker.com';
```

- `boolean` variables must be prefixed.

```ts
// ❌ Wrong
const open = false;
const children = true;

@Component
export default class MyComponent extends Vue {
  @Prop
  open: boolean;
}

// ✅ Good
const isOpen = false;
const hasChildren = true;

@Component
export default class MyComponent extends Vue {
  @Prop
  isOpen: boolean;
}
```

- If the variable refers to something measurable, add the unit name.

```ts
// ❌ Wrong
const debounceTime = 100;
const width = 85;
const height = 100;

// ✅ Good
const debounceTimeMs = 100;
const widthPercentage = 85;
const heightPx = 100;
```

- Avoid abbreviations unless they refer to a unit name, or are widely accepted concepts (like URL,
  CSS, HTML…).

```ts
// ❌ Wrong
const hq = { ... };
const qs = '?user=1234&type=new';

// ✅ Good
const historyQuery = { ... };
const queryString = '?user=1234&type=new';
const url = 'https://empathy.co';
const sizePx = 100;
```

- Use lowercase for the abbreviation only if it is the start of the variable name, and uppercase if it is
  in the middle of the word.

```ts
// ❌ Wrong
const CSSClasses = 'x-suggestion x-popular-search';
const websiteUrl = 'https://empathy.co';

// ✅ Good
const cssClasses = 'x-suggestion x-popular-search';
const websiteURL = 'https://empathy.co';
```

- Avoid repeating the context.

```ts
// ❌ Wrong
@Component
class Facets {
  @Prop()
  facets?: FacetsModel[];
  @Prop()
  facetsQuery?: string;
}

// ✅ Good
@Component
class Facets {
  @Prop()
  items?: FacetsModel[];
  @Prop()
  query?: string;
}
```

## Methods and functions

- Methods and functions must start with a verb.

```ts
// ❌ Wrong
function result() {}

// ✅ Good
function createResult() {}
```

## Interfaces and types

- The name must be written in `PascalCase`.

```ts
// ❌ Wrong
type dictionary = Record<string, unknown>;

interface search_response {}

// ✅ Good
type Dictionary = Record<string, unknown>;

interface SearchResponse {}
```

- Generic values must have a meaningful name.

```ts
// ❌ Wrong
type Dictionary<T> = Record<string, T>;

// ✅ Good
type Dictionary<Value> = Record<string, Value>;
```

- Abbreviations must be in uppercase regardless of the position.

```ts
// ❌ Wrong
interface UrlQuery {}

// ✅ Good
interface URLQuery {}
```

## Classes

The JavaScript classes introduced in ES6 are a great way to group and encapsulate code. Names must be written always in `PascalCase`. Attributes and methods must follow the
[Variables, attributes, and properties](#Variables-attributes-properties) and
[Methods and functions](#methods-and-functions) conventions.

```ts
// ❌ Wrong
class systemService {
  selected: boolean;

  query(query: string): void {}
}

// ✅ Good
class SystemService {
  isSelected: boolean;

  changeQuery(query: string): void {}
}
```

## CSS Classes

The CSS classes are named according to the
[BEM — Block Element Modifier](http://getbem.com/introduction/) convention.

- Every class must be prefixed with `x-` to avoid collision with client project naming.

```html
// ❌ Wrong
<button class="search-button">Search</button>

// ✅ Good
<button class="x-search-button">Search</button>
```

- Classes must be written in `kebab-case`.

```html
// ❌ Wrong
<button class="searchButton">Search</button>
<button class="searchButton">Search</button>

// ✅ Good
<button class="x-search-button">Search</button>
```

- The classes of an element must match the block component name.

```html
// ❌ Wrong
<button class="x-search-button">
  <span class="x-label">Search</span>
</button>

// ✅ Good
<button class="x-search-button">
  <span class="x-search-button__text">Search</span>
</button>
```

- Only one level of nesting is allowed with `block__element`.

```html
// ❌ Wrong
<div class="x-search-box">
  <span class="search-box__button">
    Search
    <span class="x-search-box__button__icon">🔎</span>
  </span>
</div>

// ✅ Good
<div class="x-search-box">
  <span class="search-box__button">
    Search
    <span class="x-search-box__button-icon">🔎</span>
  </span>
</div>
```

- Modifiers should use a prefix if they depend on a part of the state.

```html
// ❌ Wrong
<button class="x-filter--selected"></button>

// ✅ Good
<button class="x-filter--is-selected"></button>
```

## X Events

There are two types of X Events: **[user triggered events](#user-events)** and **[state change triggered events](#state-change-events)**. Each type has its own rules, but they share some common rules.

- Use the same abstraction.

```
// ❌ Wrong
UserClickedAFilter VS UserPickedARelatedTag VS UserSelectedASuggestion


// ✅ Good
UserClickedAFilter VS UserClickedARelatedTag VS UserClickedASuggestion
```

### User events

These events are emitted when the user performs an action in the website. Clicking, hovering,
typing, pressing a key are some examples of actions that the user may perform to emit these events.

- Prefix these events with `User` to clearly identify the origin.

```
// ❌ Wrong
SuggestionClicked

// ✅ Good
UserClickedASuggestion
```

- Include a verb in past tense to describe the user action that triggered the event.

```
// ❌ Wrong
UserClickSuggestion

// ✅ Good
UserClickedASuggestion
```

- Describe the action that the user performed to trigger the event, not the expected outcome of
  the user action.

```
// ❌ Wrong
UserClearedSelectedFilters

// ✅ Good
UserClickedClearSelectedFiltersButton
```

### State change events

These events are emitted when a part of the application state has changed.

- Suffix these events with `Changed`, `Loaded`, or any other suffix that explains the change type.

```
// ❌ Wrong
NewSearchRequest
UserClearedQuery

// ✅ Good
SearchRequestChanged
SearchBoxQueryCleared
```

- Describe the part of the state that changed.

```
// ❌ Wrong
QueryChanged

// ✅ Good
SearchBoxQueryChanged
```
