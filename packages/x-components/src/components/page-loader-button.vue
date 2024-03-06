<template>
  <div class="x-flex x-flex-col x-items-center x-py-32" data-test="page-loader">
    <!-- @slot Rendered count with a text and the number of results displayed & remaining. -->
    <slot name="textContent">
      <p class="x-text x-py-16" data-test="text-content">
        You are seeing {{ $x.results.length }} of {{ $x.totalResults }} results
      </p>
    </slot>
    <BaseEventButton
      class="x-button"
      :class="buttonClasses"
      :events="{ UserReachedResultsListEnd: undefined }"
      data-test="load-content"
      aria-label="Load"
    >
      <!-- @slot Button content with a text, an icon or both -->
      <slot name="buttonContent">Load</slot>
    </BaseEventButton>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { VueCSSClasses } from '../utils/types';
  import BaseEventButton from './base-event-button.vue';

  /**
   * Component that renders a text with the number of rendered results and
   * the remaining ones and a `<BaseEventButton>` with the logic of emitting
   * the event "UserReachedResultsListEnd" to load more results on click.
   *
   * @public
   */
  export default defineComponent({
    name: 'PageLoaderButton',
    components: { BaseEventButton },
    props: {
      /**
       * CSS classes to customize the loader button.
       *
       * @internal
       */
      buttonClasses: {
        type: String as PropType<VueCSSClasses>,
        default: ''
      }
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the "UserReachedResultsListEnd" event.

## See it in action

Here you have a basic example of how the page loader component is rendered.

```vue live
<template>
  <PageLoaderButton />
</template>

<script>
  import { PageLoaderButton } from '@empathyco/x-components';

  export default {
    name: 'PageLoaderButtonDemo',
    components: {
      PageLoaderButton
    }
  };
</script>
```

### Customise the layout

This component allows to customise both the textContent and the buttonContent slots. The
textContent's slot layout can be replaced entirely, while the buttonContent's slot enables wrapping
content inside and customizing its style using the buttonClasses prop.

```vue live
<template>
  <PageLoaderButton :buttonClasses="buttonClasses">
    <template #textContent>
      <div class="x-flex x-gap-4 x-text">
        <span class="x-text-accent-50 x-font-bold">{{ $x.results.length }}</span>
        <span>of</span>
        <span class="x-text-accent-50">{{ $x.totalResults }}</span>
      </div>
    </template>
    <template #buttonContent>Load more results</template>
  </PageLoaderButton>
</template>

<script>
  import { PageLoaderButton } from '@empathyco/x-components';

  export default {
    name: 'PageLoaderButtonDemo',
    components: {
      PageLoaderButton
    },
    data() {
      return {
        buttonClasses: 'x-rounded-full'
      };
    }
  };
</script>
```
</docs>
