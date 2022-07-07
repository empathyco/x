<template>
  <BaseSwitch @change="toggle" :value="isEnabled" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSwitch from '../../../components/base-switch.vue';
  import { State, xComponentMixin } from '../../../components';
  import { historyQueriesXModule } from '../x-module';

  /**
   * Toggle history queries component to enable or disable the history queries.
   * This component emits events depending on the `isEnabled` value.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(historyQueriesXModule)],
    components: { BaseSwitch }
  })
  export default class ToggleHistoryQueries extends Vue {
    /**
     * A boolean with the isEnabled value coming from the store state.
     *
     * @public
     */
    @State('historyQueries', 'isEnabled')
    public isEnabled!: boolean;

    /**
     * Emit events depending on the switch value.
     *
     * @internal
     */
    protected toggle(): void {
      if (this.isEnabled) {
        this.$x.emit('UserDisableHistoryQueries');
      } else {
        this.$x.emit('UserToggledHistoryQueries', true);
      }
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserDisableHistoryQueries`](./x-components.historyqueriesxevents.userdisablehistoryqueries.md):
  the event is emitted after the user clicks the toggle and `isEnabled` is `true`.
- [`UserToggledHistoryQueries`[(x-components.historyqueriesxevents.usertoggledhistoryqueries.md):
  the event is emitted after the user clicks the toggle and `isEnabled` is `false`.

## See it in action

Here you have a basic example of how the toggle is rendered.

_Try clicking it to see how it changes its state_

```vue live
<template>
  <ToggleHistoryQueries />
</template>

<script>
  import { ToggleHistoryQueries } from '@empathyco/x-components';

  export default {
    name: 'ToggleHistoryQueriesDemo',
    components: {
      ToggleHistoryQueries
    }
  };
</script>
```
</docs>
