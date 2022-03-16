<template>
  <BaseEventButton
    class="x-button x-clear-search-input"
    :class="dynamicClasses"
    :events="clearSearchInputEvents"
    data-test="clear-search-input"
  >
    <!-- @slot _Required_. Button content (text, icon, or both) -->
    <slot>✕</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { searchBoxXModule } from '../x-module';

  /**
   * This component renders a button to delete the current query.
   *
   * @remarks
   * A button that when pressed emits the {@link SearchBoxXEvents.UserPressedClearSearchBoxButton}
   * and {@link SearchBoxXEvents.UserClearedQuery} events, expressing the user intention to clear
   * the current query.
   * It also adds `x-clear-search-input--has-empty-query` as class when there is no query.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class ClearSearchInput extends Vue {
    @State('searchBox', 'query')
    public query!: string;

    protected get isQueryEmpty(): boolean {
      return this.query.length === 0;
    }

    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-clear-search-input--has-empty-query': this.isQueryEmpty
      };
    }

    /**
     * The events dictionary that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    protected clearSearchInputEvents: Partial<XEventsTypes> = {
      UserPressedClearSearchBoxButton: undefined
    };
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UserPressedClearSearchBoxButton`](./../../api/x-components.searchboxxevents.md)
- [`UserClearedQuery`](./../../api/x-components.searchboxxevents.md)

## See it in action

Here a basic example of how the clear button is rendered.

_Type any term in the input field and then click the Clear button to try it out!_

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <ClearSearchInput />
  </div>
</template>

<script>
  import { ClearSearchInput, SearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ClearSearchInputDemo',
    components: {
      ClearSearchInput,
      SearchInput
    }
  };
</script>
```

### Play with default slot

In this example, a custom text is passed in the default slot instead of the default text to
customize the button content.

_Click the icon button to try it out!_

```vue live
<template>
  <ClearSearchInput>Clear</ClearSearchInput>
</template>

<script>
  import { ClearSearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ClearSearchInputDemo',
    components: {
      ClearSearchInput
    }
  };
</script>
```

### Play with events

In this example, the `UserPressedClearSearchBoxButton` event is implemented, triggering the message
“clear” when the clear search input button is clicked.

_Click the Clear button to try it out!_

```vue live
<template>
  <ClearSearchInput @UserPressedClearSearchBoxButton="message = 'clear'">Clear</ClearSearchInput>
  {{ message }}
</template>

<script>
  import { ClearSearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ClearSearchInputDemo',
    components: {
      ClearSearchInput
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

Components can be combined and communicate with each other. Commonly, the `ClearSearchInput`
component communicates with the [`SearchInput`](./search-input.md), deleting the search term
entered.

_Type any term in the input field and then click the icon button to try it out!_

```vue live
<template>
  <div style="display: flex;">
    <SearchInput />
    <ClearSearchInput />
  </div>
</template>

<script>
  import { SearchInput, ClearSearchInput } from '@empathyco/x-components/search-box';

  export default {
    name: 'ClearSearchInputDemo',
    components: {
      SearchInput,
      ClearSearchInput
    }
  };
</script>
```
</docs>
