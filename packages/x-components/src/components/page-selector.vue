<template>
  <nav class="x-flex x-items-center x-justify-center x-gap-2" aria-label="Pagination">
    <button
      @click="selectPage(currentPage - 1)"
      class="x-button x-button-lead"
      :disabled="currentPage === 1"
    >
      <slot name="previous-page-button">Prev</slot>
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="selectPage(page)"
      class="x-button"
      :class="{
        'x-button-lead x-cursor-default': page === currentPage,
        'x-button-ghost': page !== currentPage,
        'x-cursor-not-allowed': page === '...'
      }"
    >
      <slot name="current-page-button">{{ page }}</slot>
    </button>

    <button
      @click="selectPage(currentPage + 1)"
      class="x-button x-button-lead"
      :disabled="currentPage === totalPages"
    >
      <slot name="next-page-button">Next</slot>
    </button>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useXBus } from '../composables';

  /**
   * Component that renders a pagination control with buttons for navigating
   * between pages. It displays the current page, allows selecting other pages,
   * and emits events when a page is selected.
   *
   * @public
   */
  export default defineComponent({
    name: 'PageSelector',
    props: {
      /**
       * The total number of pages.
       */
      totalPages: {
        type: Number,
        required: true
      },
      /**
       * The current page number.
       */
      currentPage: {
        type: Number,
        required: true
      },
      /**
       * The number of pages to show before and after the current page.
       */
      range: {
        type: Number,
        default: 2
      }
    },
    setup: function (props) {
      const bus = useXBus();

      const visiblePages = computed<(number | string)[]>(() => {
        const start = Math.max(props.currentPage - props.range, 1);
        const end = Math.min(props.currentPage + props.range, props.totalPages);
        const pages: (number | string)[] = Array.from(
          { length: end - start + 1 },
          (_, i) => start + i
        );

        // Ensure first and last pages are always visible when needed
        if (start > 1) {
          pages.unshift(1);
          if (start > 2) {
            pages.splice(1, 0, '...');
          }
        }
        if (end < props.totalPages) {
          if (end < props.totalPages - 1) {
            pages.push('...');
          }
          pages.push(props.totalPages);
        }

        return pages;
      });

      /**
       * Handles the selection of a page.
       *
       * @param page - The page to select. Can be a number representing the page number or a string '...' indicating an ellipsis.
       */
      const selectPage = (page: number | string): void => {
        if (page === '...') {
          return;
        }
        if (typeof page === 'number' && page > 0 && page <= props.totalPages) {
          bus.emit('UserSelectedAPage', page);
          /**
           * Emits scroll to top to prevent keeping the position if there is more content
           * after results, as for example Next Queries Preview.
           */
          bus.emit('UserClickedScrollToTop', 'main-scroll');
        }
      };

      return {
        visiblePages,
        selectPage
      };
    }
  });
</script>

<docs lang="mdx">
## Events

This component emits the "UserSelectedAPage" and the UserClickedScrollToTop events by default.

## See it in action

Basic example of how the component is rendered.

```vue live
<template>
  <PageSelector :current-page="page" :total-pages="totalPages" />
</template>

<script>
  import { PageSelector } from '@empathyco/x-components';

  export default {
    name: 'PageSelectorDemo',
    components: {
      PageSelector
    },
    data() {
      return {
        page: 0,
        totalPages: 10
      };
    }
  };
</script>
```

### Customize the slots

This component allows to customise the buttons using slots.

```vue live
<template>
  <template>
    <PageSelector :current-page="page" :total-pages="totalPages">
      <template #previous-page-button><<</template>
      <template #current-page-button="{ page }"><h2>{page}</h2></template>
      <template #next-page-button>>></template>
    </PageSelector>
  </template>
</template>

<script>
  import { PageSelector } from '@empathyco/x-components';

  export default {
    name: 'PageSelectorDemo',
    components: {
      PageSelector
    },
    data() {
      return {
        page: 2,
        totalPages: 10
      };
    }
  };
</script>
```

### Customize the number of pages to show before and after the current page by changing the range default value.

```vue live
<template>
  <PageSelector :current-page="page" :total-pages="totalPages" :range="range" />
</template>

<script>
  import { PageSelector } from '@empathyco/x-components';

  export default {
    name: 'PageSelectorDemo',
    components: {
      PageSelector
    },
    data() {
      return {
        page: 6,
        totalPages: 100,
        range: 4
      };
    }
  };
</script>
```
</docs>
