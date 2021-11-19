<template>
  <button
    v-if="spellcheckedQuery"
    @click="emitEvents"
    class="x-spellcheck-button"
    data-test="set-spellcheck"
  >
    <slot v-bind="{ spellcheckedQuery }">{{ spellcheckedQuery }}</slot>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { searchXModule } from '../x-module';
  /**
   * A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery}
   * and {@link XEventsTypes.UserAcceptedSpellcheckQuery} events, expressing the user
   * intention to set the spellchecked query.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class SpellcheckButton extends Vue {
    /**
     * The spellcheckedQuery from the search state.
     *
     * @public
     */
    @State('search', 'spellcheckedQuery')
    public spellcheckedQuery!: string;

    /**
     * Generates the {@link WireMetadata | event metadata} object omitting the moduleName.
     *
     * @returns The {@link WireMetadata} object omitting the moduleName.
     * @internal
     */
    protected eventMetadata(): Omit<WireMetadata, 'moduleName'> {
      return {
        target: this.$el as HTMLElement,
        feature: 'spellcheck'
      };
    }

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    protected emitEvents(): void {
      this.$x.emit('UserAcceptedAQuery', this.spellcheckedQuery, this.eventMetadata());
      this.$x.emit('UserAcceptedSpellcheckQuery', this.spellcheckedQuery, this.eventMetadata());
    }
  }
</script>

<docs lang="mdx">
# Examples

## Basic example

The component sets the current spellcheckedQuery as the new query and emits the `UserAcceptedAQuery`
and `UserAcceptedSpellcheckQuery` events.

```vue
<SpellcheckButton />
```

## Customizing its contents

```vue
<SpellcheckButton>
  <template #default="{ spellcheckedQuery }">
    <span class="x-spellcheck__text">
      Set the Spellcheck as the new query: {{ spellcheckedQuery}}!
    </span>
  </template>
</SpellcheckButton>
```

## Events

This component emits 2 different events:

- UserAcceptedAQuery: the event is emitted after the user clicks the button. The event payload is
  the spellchecked query data.
- UserAcceptedSpellcheckQuery: the event is emitted after the user clicks the button. The event
  payload is the spellchecked query data.
</docs>
