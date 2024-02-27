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
      <slot name="buttonContent" />
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
