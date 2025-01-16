<template>
  <nav v-if="visiblePages?.length > 1" class="x-page-selector" aria-label="Pagination">
    <button
      @click="selectPage(currentPage - 1)"
      class="x-button"
      :class="buttonClasses"
      :disabled="currentPage === 1"
      data-test="previous-page-button"
      aria-label="Previous page"
      :aria-disabled="currentPage === 1"
    >
      <slot name="previous-page-button">Prev</slot>
    </button>

    <button
      v-for="page in visiblePages"
      :key="page.value"
      @click="selectPage(page.value)"
      class="x-button x-page-selector__page"
      :class="[
        itemClasses(page.isSelected),
        {
          'x-page-selector__page--current': page.isSelected,
          'x-page-selector__page--hidden': page.value === hiddenPage
        }
      ]"
      :data-test="`page-button-${page.value}`"
      :aria-label="`Page ${page.value}`"
      :aria-current="page.isSelected ? 'page' : undefined"
    >
      <slot name="page-button" :page="page.value" :is-selected="page.isSelected">
        {{ page.value }}
      </slot>
    </button>

    <button
      @click="selectPage(currentPage + 1)"
      class="x-button"
      :class="buttonClasses"
      :disabled="currentPage === totalPages"
      data-test="next-page-button"
      aria-label="Next page"
      :aria-disabled="currentPage === totalPages"
    >
      <slot name="next-page-button">Next</slot>
    </button>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';
  import { Dictionary } from '@empathyco/x-utils';
  import { useXBus } from '../composables';

  interface PageItem {
    value: number | string;
    isSelected: boolean;
  }

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
       * CSS classes to customize the prev/next buttons.
       */
      buttonClasses: {
        type: Array as PropType<(string | Dictionary<boolean>)[]>,
        default: () => []
      },
      /**
       * The current page number.
       */
      currentPage: {
        type: Number,
        required: true
      },
      /**
       * The string content of the hidden pages.
       */
      hiddenPage: {
        type: String,
        default: '...'
      },
      /**
       * CSS classes to customize the page items.
       */
      itemClasses: {
        type: Function as PropType<
          (isSelected: boolean) => string | Dictionary<boolean> | (string | Dictionary<boolean>)[]
        >,
        default: () => []
      },
      /**
       * The number of pages to show before and after the current page.
       */
      range: {
        type: Number,
        default: 2
      },
      /**
       * The class of the scroll container to scroll to top when a page is selected.
       */
      scrollTarget: {
        type: String,
        default: 'main-scroll'
      },
      /**
       * The total number of pages.
       */
      totalPages: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const bus = useXBus();

      const visiblePages = computed(() => {
        const start = Math.max(props.currentPage - props.range, 1);
        const end = Math.min(props.currentPage + props.range, props.totalPages);
        const pages: PageItem[] = Array.from({ length: end - start + 1 }, (_, i) => {
          const pageValue: string | number = start + i;
          return { value: pageValue, isSelected: pageValue === props.currentPage };
        });

        // Ensure first and last pages are always visible when needed
        if (start > 1) {
          pages.unshift({ value: 1, isSelected: 1 === props.currentPage });
          if (start > 2) {
            pages.splice(1, 0, { value: props.hiddenPage, isSelected: false });
          }
        }
        if (end < props.totalPages) {
          if (end < props.totalPages - 1) {
            pages.push({ value: props.hiddenPage, isSelected: false });
          }
          pages.push({
            value: props.totalPages,
            isSelected: props.totalPages === props.currentPage
          });
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
          bus.emit('UserClickedScrollToTop', props.scrollTarget);
        }
      };

      return {
        visiblePages,
        selectPage
      };
    }
  });
</script>

<style lang="scss" scoped>
  .x-page-selector {
    display: flex;
    justify-content: center;
    gap: 2px;

    &__page {
      &--current,
      &--hidden {
        cursor: default;
      }
    }
  }
</style>

<docs lang="mdx">
## Events

This component emits the "UserSelectedAPage" and the UserClickedScrollToTop events by default.

## See it in action

Basic example of how the component is rendered.

```vue live
<template>
  <PageSelector :current-page="currentPage" :total-pages="totalPages" />
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
    },
    computed: {
      currentPage() {
        return this.page;
      }
    }
  };
</script>
```

### Customize the slots

This component allows to customise its content using slots.

```vue live
<template>
  <PageSelector
    :total-pages="totalPages"
    :currentPage="currentPage"
    :item-classes="
      (isSelected: boolean) =>
        isSelected
          ? 'x-button-lead x-text-neutral-10'
          : 'x-text-neutral-90 x-button-outlined'
    "
    :buttonClasses="['x-rounded-md']"
  >
    <template #previous-page-button>
      <span>Back</span>
    </template>
    <template #page-button="{ page, isSelected }">
      <h2 :class="{ 'x-text1': !isSelected }">
        {{ page }}
      </h2>
    </template>
    <template #next-page-button>
      <span>Forward</span>
    </template>
  </PageSelector>
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
    },
    computed: {
      currentPage() {
        return this.page;
      }
    }
  };
</script>
```

### Customize the number of pages to show before and after the current page by changing the range default value.

```vue live
<template>
  <PageSelector :current-page="currentPage" :total-pages="totalPages" :range="range" />
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
    },
    computed: {
      currentPage() {
        return this.page;
      }
    }
  };
</script>
```
</docs>
