# Naming

## Variables, attributes, properties

These rules are applicable for any kind of variable, either if it is defined as an attribute, class
property, object property, Vue component prop.

- Its name must be written in `camelCase`:

```ts
// ❌ Wrong
const search_box_query = 'beer';
const SearchBoxQuery = 'beer';

// ✅ Good
const searchBoxQuery = 'beer';
```

- Avoid adding words that do not add value:

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

- `boolean` variables have to be prefixed:

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

- If the variable refers to something measurable, add the unit name:

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
  CSS, HTML…):

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

- Use lowercase for the abbreviation if it is the start of the variable name, and uppercase if it is
  in the middle of the word.

```ts
// ❌ Wrong
const CSSClasses = 'x-suggestion x-popular-search';
const websiteUrl = 'https://empathy.co';

// ✅ Good
const cssClasses = 'x-suggestion x-popular-search';
const websiteURL = 'https://empathy.co';
```

- Avoid repeating the context:

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

## Methods and Functions

- Must start with a verb

```ts
// ❌ Wrong
function result() {}

// ✅ Good
function createResult() {}
```

## Interfaces andTypes

- Its name must be written in `PascalCase`

```ts
// ❌ Wrong
type dictionary = Record<string, unknown>;

interface search_response {}

// ✅ Good
type Dictionary = Record<string, unknown>;

interface SearchResponse {}
```

- Generics must have a proper readable name.

```ts
// ❌ Wrong
type Dictionary<T> = Record<string, T>;

// ✅ Good
type Dictionary<Value> = Record<string, Value>;
```

- Abbreviations must be in upper case regardless of their position:

```ts
// ❌ Wrong
interface UrlQuery {}

// ✅ Good
interface URLQuery {}
```

## Classes

The JavaScript Classes introduced in ES06, are a great way to group and encapsulate code. Their
names must be written always in `PascalCase` . Its attributes and methods must follow the
[Variables, attributes, properties](#Variables,-attributes,-properties) and
[Methods and Functions](#methods-and-functions) conventions.

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

The CSS classes are named following the
[BEM — Block Element Modifier](http://getbem.com/introduction/) convention.

- Every class must be prefixed with `x-` to avoid collision with client projects naming.

```html
// ❌ Wrong
<button class="search-button">Search</button>

// ✅ Good
<button class="x-search-button">Search</button>
```

- Classes must be written in `kebab-case`

```html
// ❌ Wrong
<button class="searchButton">Search</button>
<button class="searchButton">Search</button>

// ✅ Good
<button class="x-search-button">Search</button>
```

- The Classes of an element must match the block component name:

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

- There is only a level of nesting allowed with `block__element`.

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

- Modifier part should use a prefix if it depends on a part of the state

```html
// ❌ Wrong
<button class="x-filter--selected"></button>

// ✅ Good
<button class="x-filter--is-selected"></button>
```

## X Events

So far there are 2 types of X Events: User triggered events, and state change triggered events. Each
one of these events kinds has its own rules, but they share some similarities:

- Use the same abstraction:

```
// ❌ Wrong
UserClickedAFilter VS UserPickedARelatedTag VS UserSelectedASuggestion


// ✅ Good
UserClickedAFilter VS UserClickedARelatedTag VS UserClickedASuggestion
```

### User triggered events

These are events emitted because the user performed an action in the website. Clicking, hovering,
typing, pressing a key are some examples of actions that the user can do to emit these events.

- They must be prefixed with `User` to clearly identify its origin.

```
// ❌ Wrong
SuggestionClicked

// ✅ Good
UserClickedASuggestion
```

- They must include a verb in past tense that describe what user action triggered the event.

```
// ❌ Wrong
UserClickSuggestion

// ✅ Good
UserClickedASuggestion
```

- They must describe the action that the user did to trigger that event, not the expected effects of
  the user action.

```
// ❌ Wrong
UserClearedSelectedFilters

// ✅ Good
UserClickedClearSelectedFiltersButton
```

### State change triggered events

These events are emitted because a part of the application state has changed.

- They must be suffixed with `Changed`, `Loaded`, or any other suffix that explains the change type.

```
// ❌ Wrong
NewSearchRequest
UserClearedQuery

// ✅ Good
SearchRequestChanged
SearchBoxQueryCleared
```

- They must describe precisely which part of the state changed.

```
// ❌ Wrong
QueryChanged

// ✅ Good
SearchBoxQueryChanged
```
