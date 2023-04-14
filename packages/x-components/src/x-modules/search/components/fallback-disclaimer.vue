<template>
  <div
    v-if="$x.fromNoResultsWithFilters"
    class="x-fallback-disclaimer"
    data-test="fallback-disclaimer"
  >
    <slot v-bind="{ query: $x.query.search }">
      No results found for {{ $x.query.search }} with the selected filters. The filters have been
      unselected.
    </slot>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components';
  import { searchXModule } from '../x-module';

  /**
   * The `FallbackDisclaimer` component shows a message if the filters have been removed
   * from the current search because there were no results.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchXModule)]
  })
  export default class FallbackDisclaimer extends Vue {}
</script>

<docs lang="mdx">
## Examples

This default fallback disclaimer component reads the query from the search state and passes it to
its default slot. This component will be rendered if there is a no results with filters situation.

### Basic usage

```vue
<FallbackDisclaimer />
```

### Customizing its contents

```vue
<FallbackDisclaimer>
  <template #default="{ query }">
    No results found for '{{ query }}' with the selected filters. The filters have been unselected.
  </template>
</FallbackDisclaimer>

<script>
  import { FallbackDisclaimer } from '@empathyco/x-components/search';

  export default {
    components: {
      FallbackDisclaimer
    }
  };
</script>
```
</docs>
