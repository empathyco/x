<template>
  <button
    @click="emitEvents"
    class="x-button x-partial-query-button"
    data-test="partial-query-button"
  >
    <slot v-bind="{ query }">{{ query }}</slot>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components';
  import { searchXModule } from '../x-module';

  /**
   * A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery}
   * and {@link SearchXEvents.UserClickedPartialQuery} events, expressing the user
   * intention to set the partial query.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class PartialQueryButton extends Vue {
    /**
     * The query property.
     *
     * @public
     */
    @Prop({ required: true })
    public query!: string;

    /**
     * Emits events when the button is clicked.
     *
     * @public
     */
    protected emitEvents(): void {
      this.$x.emit('UserAcceptedAQuery', this.query, {
        target: this.$el as HTMLElement
      });
      this.$x.emit('UserClickedPartialQuery', this.query, {
        target: this.$el as HTMLElement
      });
    }
  }
</script>

<docs lang="mdx">
# Examples

## Basic example

A button that when pressed emits the {@link XEventsTypes.UserAcceptedAQuery} and {@link
SearchXEvents.UserClickedPartialQuery} events, expressing the user intention to set the partial
query.

The component sets the current query as the new query and emits the `UserAcceptedAQuery` and
`UserClickedPartialQuery` events when is clicked.

```vue
<template>
  <PartialQueryButton :query="query" />
</template>
```

## Customizing its contents

```vue
<template>
  <PartialQueryButton>
    <template #default="{ query }">
      <span class="x-partial-query-button__text">
        Set the Partial query as the new query: {{ query }}!
      </span>
    </template>
  </PartialQueryButton>
</template>

<script>
  import { PartialQueryButton } from '@empathyco/x-components/search';

  export default {
    components: {
      PartialQueryButton
    }
  };
</script>
```

## Events

This component emits 2 different events:

- UserAcceptedAQuery: the event is emitted after the user clicks the partial query. The event
  payload is the partial query data.
- UserClickedPartialQuery: the event is emitted after the user clicks the partial query. The event
  payload is the partial query data.
</docs>
