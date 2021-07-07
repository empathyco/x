<template>
  <BaseEventButton
    :events="events"
    class="x-button x-search-button"
    :class="dynamicClasses"
    data-test="search-button"
  >
    <!-- @slot _Required_. Button content (text, icon, or both) -->
    <slot><span class="x-icon">⌕</span></slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * This component renders a button to submit the query.
   *
   * @remarks
   * If query is not empty, it emits {@link XEventsTypes.UserAcceptedAQuery} and
   * {@link SearchBoxXEvents.UserPressedSearchButton} events with the query as payload.
   * It also adds `x-search-button--has-empty-query` as class when there is no query.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)],
    components: { BaseEventButton }
  })
  export default class SearchButton extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get events(): Partial<XEventsTypes> {
      return !this.isQueryEmpty
        ? {
            UserAcceptedAQuery: this.query,
            UserPressedSearchButton: this.query
          }
        : {};
    }

    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-search-button--has-empty-query': this.isQueryEmpty
      };
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserAcceptedAQuery`](./../../api/x-components.xeventstypes.md)
- [`UserPressedSearchButton`](./../../api/x-components.searchboxxevents.md)

<!-- prettier-ignore-start -->
:::warning
Note that no events are emitted if the query is empty.
:::
<!-- prettier-ignore-end -->

## Dynamic classes

`SearchButton` uses the `x-search-button--has-empty-query` dynamic CSS class to modify the HTML
button style when the query is empty.

## See it in action

In this example, a clickable button is rendered.

_Click the Search button to try it out!_

```vue
<template>
  <SearchButton />
</template>

<script>
  import { SearchButton } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchButton
    }
  };
</script>
```

### Play with default slot

Here an icon is passed in the default slot instead of text to customize the button content.

_Click the icon button to try it out!_

```vue
<template>
  <SearchButton>Search</SearchButton>
</template>

<script>
  import { SearchButton } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchButton
    }
  };
</script>
```

### Play with events

In this example, the `UserPressedSearchButton` event has been implemented so that when you enter a
search term and click the Search button, the search term is displayed as a message.

_Type any term in the input field and then click the Search button to try it out!_

```vue
<template>
  <SearchButton
    @UserPressedSearchButton="
      query => {
        message = query;
      }
    "
  />
</template>

<script>
  import { SearchButton } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchButton
    }
  };
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `SearchButton` component
communicates with the [`SearchInput`](./search-input.md) to submit the query. In this example, when
you enter a search term and click the Search button, the “Looking for results” message is displayed.

_Type any term in the input field and then click the Search button to try it out!_

```vue
<template>
  <SearchInput />
  <SearchButton @UserAcceptedAQuery="message = 'looking for results'">Search</SearchButton>
</template>

<script>
  import { SearchButton, SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchButton,
      SearchInput
    }
  };
</script>
```
</docs>
