<template>
  <div class="x-related-prompt" data-test="related-prompt">
    <div class="x-related-prompt__info x-flex x-flex-col">
      <slot name="header" :suggestionText="relatedPrompt.suggestionText">
        {{ relatedPrompt.suggestionText }}
      </slot>
      <slot name="next-queries" :nextQueries="relatedPrompt.nextQueries">
        <SlidingPanel :resetOnContentChange="false">
          <div class="x-flex x-gap-8">
            <button
              v-for="(nextQuery, index) in relatedPrompt.nextQueries"
              :key="index"
              @click="onClick(nextQuery)"
              :class="[{ 'x-selected': selectedNextQuery === nextQuery }, nextQueryButtonClass]"
            >
              <span>{{ nextQuery }}</span>
              <CrossTinyIcon v-if="selectedNextQuery === nextQuery" class="x-icon" />
              <PlusIcon v-else class="x-icon" />
            </button>
          </div>
        </SlidingPanel>
      </slot>
    </div>
    <div class="x-related-prompt__query-preview">
      <slot name="selected-query" :selectedQuery="selectedNextQuery">
        {{ selectedNextQuery }}
      </slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  import { RelatedPrompt } from '@empathyco/x-types';
  import { relatedPromptsXModule } from '../x-module';
  import CrossTinyIcon from '../../../components/icons/cross-tiny.vue';
  import PlusIcon from '../../../components/icons/plus.vue';
  import SlidingPanel from '../../../components/sliding-panel.vue';
  export default defineComponent({
    name: 'RelatedPrompt',
    components: {
      SlidingPanel,
      CrossTinyIcon,
      PlusIcon
    },
    xModule: relatedPromptsXModule.name,
    props: {
      relatedPrompt: {
        type: Object as PropType<RelatedPrompt>,
        required: true
      },
      nextQueryButtonClass: {
        type: String,
        default: 'x-button x-button-outlined'
      }
    },
    setup(props) {
      const selectedNextQuery = ref(props.relatedPrompt.nextQueries[0]);

      /**
       * Handles the click event on a next query button.
       *
       * @param nextQuery - The clicked next query.
       */
      function onClick(nextQuery: string): void {
        if (selectedNextQuery.value === nextQuery) {
          selectedNextQuery.value = '';
        } else {
          selectedNextQuery.value = nextQuery;
        }
      }

      return { selectedNextQuery, onClick };
    }
  });
</script>
