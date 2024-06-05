<template>
  <button
    v-if="spellcheckedQuery"
    ref="el"
    @click="emitEvents"
    class="x-spellcheck-button"
    data-test="set-spellcheck"
  >
    <slot v-bind="{ spellcheckedQuery }">{{ spellcheckedQuery }}</slot>
  </button>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { searchXModule } from '../x-module';
  import { use$x } from '../../../composables/use-$x';
  import { useRegisterXModule } from '../../../composables/use-register-x-module';
  import { useState } from '../../../composables/use-state';

  /**
   * A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery}
   * and {@link XEventsTypes.UserAcceptedSpellcheckQuery} events, expressing the user
   * intention to set the spellchecked query.
   *
   * @public
   */
  export default defineComponent({
    name: 'SpellcheckButton',
    xModule: searchXModule.name,
    setup() {
      useRegisterXModule(searchXModule);

      const $x = use$x();

      const el = ref<HTMLElement>();

      /**
       * The spellcheckedQuery from the search state.
       *
       * @public
       */
      const { spellcheckedQuery } = useState('search', ['spellcheckedQuery']);

      /**
       * Generates the {@link WireMetadata} object omitting the moduleName.
       *
       * @returns The {@link WireMetadata} object omitting the moduleName.
       * @internal
       */
      const createEventMetadata = (): Omit<WireMetadata, 'moduleName'> => ({
        target: el.value as HTMLElement,
        feature: 'spellcheck'
      });

      /**
       * Emits events when the button is clicked.
       *
       * @public
       */
      const emitEvents = () => {
        $x.emit('UserAcceptedAQuery', spellcheckedQuery.value as string, createEventMetadata());
        $x.emit(
          'UserAcceptedSpellcheckQuery',
          spellcheckedQuery.value as string,
          createEventMetadata()
        );
      };

      return {
        el,
        spellcheckedQuery,
        emitEvents
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits 2 different events:

- [`UserAcceptedAQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the spellchecked query
  data.
- [`UserAcceptedSpellcheckQuery`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event is emitted after the user clicks the button. The event payload is the spellchecked query
  data.

## Examples

### Basic example

The component sets the current spellcheckedQuery as the new query and emits the `UserAcceptedAQuery`
and `UserAcceptedSpellcheckQuery` events.

```vue
<SpellcheckButton />
```

### Customizing its contents

```vue
<SpellcheckButton>
  <template #default="{ spellcheckedQuery }">
    <span class="x-spellcheck__text">
      Set the Spellcheck as the new query: {{ spellcheckedQuery}}!
    </span>
  </template>
</SpellcheckButton>
```
</docs>
