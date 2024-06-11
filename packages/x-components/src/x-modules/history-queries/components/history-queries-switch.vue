<template>
  <BaseSwitch @change="toggle" :value="isEnabled" aria-label="Queries' history" />
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { HistoryQuery } from '@empathyco/x-types';
  import BaseSwitch from '../../../components/base-switch.vue';
  import { historyQueriesXModule } from '../x-module';
  import { isArrayEmpty } from '../../../utils/array';
  import { use$x } from '../../../composables/use-$x';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useState } from '../../../composables/use-state';

  /**
   * History Queries Switch is a component to activate or deactivate the history queries.
   * This component emits events depending on the `isEnabled` value.
   *
   * @public
   */
  export default defineComponent({
    name: 'HistoryQueriesSwitch',
    xModule: historyQueriesXModule.name,
    components: {
      BaseSwitch
    },
    setup() {
      useRegisterXModule(historyQueriesXModule);

      const $x = use$x();

      /**
       * An object with the isEnabled value and the history queries coming from the store state.
       *
       * @internal
       */
      const { isEnabled, historyQueries } = useState('historyQueries', [
        'isEnabled',
        'historyQueries'
      ]);

      /**
       * Checks if there are history queries.
       *
       * @returns True if there are history queries; false otherwise.
       */
      const hasHistoryQueries = computed(
        () => !isArrayEmpty(historyQueries.value as HistoryQuery[])
      );

      const disableEvent = computed(() =>
        hasHistoryQueries.value
          ? 'UserClickedDisableHistoryQueries'
          : 'UserClickedConfirmDisableHistoryQueries'
      );

      /**
       * Emits an event based on the switch state.
       *
       * @internal
       */
      const toggle = (): void => {
        $x.emit(isEnabled.value ? disableEvent.value : 'UserClickedEnableHistoryQueries');
      };

      return {
        toggle,
        isEnabled
      };
    }
  });
</script>

<docs lang="mdx">
## Events

A list of events that the component will emit:

- [`UserClickedEnableHistoryQueries`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted whenever the user clicks the switch and the history queries are deactivated.
- [`UserClickedDisableHistoryQueries`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted whenever the user clicks the switch when the history queries are activated
  and the list of history queries is not empty.
- [`UserClickedConfirmDisableHistoryQueries`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted whenever the user clicks the switch when the history queries are activated
  and the list of history queries is empty.

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
      <HistoryQueriesSwitch />
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
          UserClickedConfirmDisableHistoryQueries: undefined,
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
