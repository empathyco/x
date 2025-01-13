<template>
  <nav class="x-flex x-items-center x-justify-center x-gap-2" aria-label="Pagination">
    <button
      @click="selectPage(currentPage - 1)"
      class="x-button x-button-neutral x-bg-neutral-50 x-text-auxiliary-75"
      :disabled="currentPage === 1"
    >
      Prev
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="selectPage(page)"
      class="x-button"
      :class="{
        'x-button-lead': page === currentPage,
        'x-button-ghost': page !== currentPage,
        'x-cursor-not-allowed': page === '...'
      }"
    >
      {{ page }}
    </button>

    <button
      @click="selectPage(currentPage + 1)"
      class="x-button x-button-lead"
      :disabled="currentPage === totalPages"
    >
      Next
    </button>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useXBus } from '../composables';

  export default defineComponent({
    name: 'PageSelector',
    props: {
      totalPages: {
        type: Number,
        required: true
      },
      currentPage: {
        type: Number,
        required: true
      }
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
      const xbus = useXBus();
      const visiblePages = computed(() => {
        const range = 2; // Number of pages to show before and after the current page
        const start = Math.max(props.currentPage - range, 1);
        const end = Math.min(props.currentPage + range, props.totalPages);

        const pages: number[] | string[] = [];
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

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

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const selectPage = page => {
        if (page === '...') {
          return;
        }
        if (page > 0 && page <= props.totalPages) {
          emit('update:currentPage', page);
          xbus.emit('UserSelectedAPage', page as number);
        }
      };

      return {
        visiblePages,
        selectPage
      };
    }
  });
</script>
