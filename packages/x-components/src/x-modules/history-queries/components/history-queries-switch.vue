<template>
  <BaseSwitch @change="toggle" :value="isEnabled" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseSwitch from '../../../components/base-switch.vue';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { historyQueriesXModule } from '../x-module';

  /**
   * History Queries Switch is a component to enable or disable the history queries.
   * This component emits events depending on the `isEnabled` value.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(historyQueriesXModule)],
    components: { BaseSwitch }
  })
  export default class HistoryQueriesSwitch extends Vue {
    /**
     * A boolean with the isEnabled value coming from the store state.
     *
     * @internal
     */
    @State('historyQueries', 'isEnabled')
    public isEnabled!: boolean;

    /**
     * Emits an event based on the switch state.
     *
     * @internal
     */
    protected toggle(): void {
      this.$x.emit(
        this.isEnabled ? 'UserClickedDisableHistoryQueries' : 'UserClickedEnableHistoryQueries'
      );
    }
  }
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedEnableHistoryQueries`]
  (x-components.historyqueriesxevents.userclickedenablehistoryqueries.md): the event is emitted
  whenever the user clicks the switch and the history queries are disabled.
- [`UserClickedDisableHistoryQueries`]
  (x-components.historyqueriesxevents.userclickeddisablehistoryqueries.md): the event is emitted
  whenever the user clicks the switch and the history queries are enabled.

## See it in action

Here you have a basic example of how the switch is rendered.

_Try clicking it to see how it changes its state_

```vue live
<template>
  <HistoryQueriesSwitch />
</template>

<script>
  import { HistoryQueriesSwitch } from '@empathyco/x-components';

  export default {
    name: 'HistoryQueriesSwitchDemo',
    components: {
      HistoryQueriesSwitch
    }
  };
</script>
```

Here you have a more complex example.

```vue live
<template>
  <div>
    <div>
      <SearchInput :instant="false" />
      <SearchButton>Search</SearchButton>
    </div>
    <label>
      History queries:
      <ToggleHistoryQueries />
      <HistoryQueries />
      <BaseEventsModal :eventsToOpenModal="eventsToOpenModal">
        <BaseEventButton :events="disableEvents">Disable</BaseEventButton>
        <BaseEventButton :events="cancelEvents">Cancel</BaseEventButton>
      </BaseEventsModal>
    </label>
  </div>
</template>

<script>
  import { BaseEventButton, BaseEventsModal } from '@empathyco/x-components';
  import { HistoryQueriesSwitch, HistoryQueries } from '@empathyco/x-components/history-queries';
  import { SearchInput, SearchButton } from '@empathyco/x-components/search';
  export default {
    name: 'HistoryQueriesSwitchDemo',
    components: {
      BaseEventButton,
      BaseEventsModal,
      HistoryQueriesSwitch,
      HistoryQueries,
      SearchInput,
      SearchButton
    },
    data() {
      return {
        eventsToOpenModal: ['UserClickedDisableHistoryQueries'],
        disableEvents: {
          UserConfirmedDisableHistoryQueries: undefined,
          UserClickedCloseEventsModal: undefined
        },
        cancelEvents: {
          UserClickedCloseEventsModal: undefined
        }
      };
    }
  };
</script>
```
</docs>
