<template>
  <button
    @click="emitEvents"
    class="x-button x-search-button"
    :class="dynamicClasses"
    data-test="search-button"
  >
    <!-- @slot _Required_. Button content (text, icon, or both) -->
    <slot><span class="x-icon">⌕</span></slot>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { WireMetadata } from '../../../wiring/wiring.types';
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
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchButton extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    /**
     * Generates the {@link WireMetadata | event metadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    protected createEventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$el as HTMLElement,
        feature: 'search_box'
      };
    }

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    protected emitEvents(): void {
      if (!this.isQueryEmpty) {
        this.$x.emit('UserAcceptedAQuery', this.query, this.createEventMetadata());
        this.$x.emit('UserPressedSearchButton', this.query, this.createEventMetadata());
      }
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

```vue live
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

Here text is passed in the default slot instead of an icon to customize the button content.

_Click the icon button to try it out!_

```vue live
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

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <SearchButton
      @UserPressedSearchButton="
        query => {
          message = query;
        }
      "
    />
  </div>
  {{ message }}
</template>

<script>
  import { SearchInput, SearchButton } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchInput,
      SearchButton
    },
    data() {
      return {
        message: ''
      };
    }
  };
</script>
```

## Extending the component

Components can be combined and communicate with each other. Commonly, the `SearchButton` component
communicates with the [`SearchInput`](./search-input.md) to submit the query. In this example, when
you enter a search term and click the Search button, the “Looking for results” message is displayed.

_Type any term in the input field and then click the Search button to try it out!_

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <SearchButton @UserAcceptedAQuery="message = 'looking for results'">Search</SearchButton>
  </div>
  {{ message }}
</template>

<script>
  import { SearchButton, SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchButtonDemo',
    components: {
      SearchButton,
      SearchInput
    },
    data() {
      return {
        message: ''
      };
    }
  };
</script>
```
</docs>
