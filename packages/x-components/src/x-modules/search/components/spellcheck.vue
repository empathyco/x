<template>
  <div v-if="spellcheckedQuery" class="x-spellcheck" data-test="spellcheck">
    <slot v-bind="{ query, spellcheckedQuery }">{{ query }} - {{ spellcheckedQuery }}</slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import { searchXModule } from '../x-module';
  /**
   * The `Spellcheck` component allows to inform the user with a friendly message that he
   might have misspelled the search query. This message can be set using the default slot
   of the component, which gives access to the searched query using the `query` scope property,
   and the spellchecked query proposal, using the `spellcheckedQuery` scope property.
   
   The component will only render itself if the `spellcheckedQuery` property has value.
   
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class Spellcheck extends Vue {
    /**
     * The query from the search state.
     *
     * @public
     */
    @State('search', 'query')
    public query!: string;

    /**
     * The spellcheckedQuery from the search state.
     *
     * @public
     */
    @State('search', 'spellcheckedQuery')
    public spellcheckedQuery!: string;
  }
</script>

<docs>
#Example

This default spellcheck component expects a query and a spellcheckedQuery to render
and pass to its default slot.

This two props should be show like a message comparing them.

## Basic usage

```vue

<Spellcheck />
```

## Customizing its contents

```vue
<Spellcheck>
  <template #default="{ query, spellcheckedQuery }">
    No results found for '{{ query }}'. We show you results for '{{ spellcheckedQuery }}'
  </template>
</Spellcheck>

<script>
  import { Spellcheck } from '@empathy/x-components/search';

  export default {
    components: {
      Spellcheck
    }
  };
</script>
```
</docs>
