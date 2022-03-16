<template>
  <BaseEventButton
    class="x-button x-clear-history-queries"
    :class="dynamicClasses"
    :disabled="isHistoryQueriesEmpty"
    :events="clearHistoryQueriesEvents"
    data-test="clear-history-queries"
  >
    <!-- @slot (Required) Button content with a message, an icon or both -->
    <slot>✕</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import { HistoryQuery } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { VueCSSClasses } from '../../../utils/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { historyQueriesXModule } from '../x-module';

  /**
   * A button that when is pressed, emits the
   * {@link HistoryQueriesXEvents.UserPressedClearHistoryQueries} event, expressing the user
   * intention to clear the whole history of queries.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(historyQueriesXModule)]
  })
  export default class ClearHistoryQueries extends Vue {
    /**
     * The whole history queries.
     *
     * @internal
     */
    @State('historyQueries', 'historyQueries')
    public historyQueries!: HistoryQuery[];

    /**
     * Returns if the array of history queries is empty.
     *
     * @returns `true` if the {@link historyQueries} array is empty, `false` otherwise.
     * @internal
     */
    protected get isHistoryQueriesEmpty(): boolean {
      return this.historyQueries.length === 0;
    }

    /**
     * Dynamic CSS classes to add to the root element of this component.
     *
     * @returns A booleans dictionary where each key is the class name to add, and the boolean value
     * tells if it should be added or not.
     * @internal
     */
    protected get dynamicClasses(): VueCSSClasses {
      return {
        'x-clear-history-queries--is-empty': this.isHistoryQueriesEmpty
      };
    }

    /**
     * The list of events that are going to be emitted when the button is pressed.
     *
     * @internal
     */
    protected clearHistoryQueriesEvents: Partial<XEventsTypes> = {
      UserPressedClearHistoryQueries: undefined
    };
  }
</script>

<docs lang="mdx">
## Examples

### Basic example

The component exposes a single default slot, where you can add icons or text.

```vue live
<template>
  <SearchInput />
  <ClearHistoryQueries>Clear history queries</ClearHistoryQueries>
  <HistoryQueries :animation="'FadeAndSlide'" :maxItemsToRender="10" />
</template>

<script>
  import Vue from 'vue';
  import { SearchInput } from '@empathyco/x-components/search-box';
  import { HistoryQueries, ClearHistoryQueries } from '@empathyco/x-components/history-queries';
  import { FadeAndSlide } from '@empathyco/x-components';

  // Registering the animation as a global component
  Vue.component('FadeAndSlide', FadeAndSlide);
  export default {
    name: 'ClearHistoryQueriesDemo',
    components: {
      SearchInput,
      HistoryQueries,
      ClearHistoryQueries
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserPressedClearHistoryQueries`: the event is emitted after the user clicks the button.
</docs>
