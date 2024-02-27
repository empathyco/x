<template>
  <div
    v-if="$x.query.searchBox && $x.results.length > 0"
    class="x-flex x-flex-col x-items-center x-py-32"
  >
    <!-- @slot Rendered count with a text and the number of results displayed & remaining. If not provided, it won't render anything. -->
    <slot v-if="$scopedSlots.renderedCount" name="renderedCount">
      <p class="x-text x-py-16">
        You are seeing {{ $x.results.length }} of {{ $x.totalResults }} results
      </p>
    </slot>
    <BaseEventButton
      v-if="$x.results.length < $x.totalResults"
      class="x-button"
      :class="buttonClasses"
      :events="{ UserReachedResultsListEnd: undefined }"
    >
      <!-- @slot (Required) Button content with a text, an icon or both -->
      <slot name="buttonContent">Load</slot>
    </BaseEventButton>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { VueCSSClasses } from '../utils/types';
  import BaseEventButton from './base-event-button.vue';

  /**
   * Component to be reused that renders a `<BaseEventButton>` with the logic of emitting the
   * "UserReachedResultsListEnd" event to load more results on click. It can also render a text
   * with the number of rendered results and the remaining ones.
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
    },
    setup(props) {
      return { props };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the "UserReachedResultsListEnd" event.

## See it in action

Here you have a basic example of how the page loader component is rendered. Notice that if the
renderedCount slot is not included, it won't be rendered.

```vue live
<template>
  <PageLoaderButton>
    <template #buttonContent></template>
  </PageLoaderButton>
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

This component allows to customise both the renderedCount and the buttonContent slots. The
renderedCount's slot layout can be replaced entirely (or removed, as seen above), while the
buttonContent's slot enables wrapping content inside and customizing its style using the
buttonClasses prop.

```vue live
<template>
  <PageLoaderButton :buttonClasses="buttonClasses">
    <template #renderedCount>
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
