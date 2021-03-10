<template>
  <BaseEventButton
    v-if="spellcheckedQuery"
    :events="events"
    class="x-spellcheck-button"
    data-test="set-spellcheck"
  >
    <slot v-bind="{ spellcheckedQuery }">{{ spellcheckedQuery }}</slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { BaseEventButton, State, xComponentMixin } from '../../../components';
  import { XEventsTypes } from '../../../wiring';
  import { searchXModule } from '../x-module';
  /**
   * A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery}
   * and {@link XEventsTypes.UserAcceptedSpellcheckQuery} events, expressing the user
   * intention to set the spellchecked query.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
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
     * Events list which are going to be emitted when the button is clicked.
     *
     * @returns The {@link XEvent | XEvents} to emit.
     *
     * @public
     */
    protected get events(): Partial<XEventsTypes> {
      return {
        UserAcceptedAQuery: this.spellcheckedQuery,
        UserAcceptedSpellcheckQuery: this.spellcheckedQuery
      };
    }
  }
</script>

<docs lang="mdx">
#Examples

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
</docs>
