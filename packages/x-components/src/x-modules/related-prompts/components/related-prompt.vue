<template>
  <div class="x-related-prompt" data-test="related-prompt">
    <div class="x-related-prompt__info">
      <slot name="header" :suggestionText="relatedPrompt.suggestionText">
        {{ relatedPrompt.suggestionText }}
      </slot>
      <slot name="next-queries" :nextQueries="relatedPrompt.nextQueries">
        <SlidingPanel :resetOnContentChange="false">
          <div class="x-related-prompt__sliding-panel-content">
            <button
              v-for="(nextQuery, index) in relatedPrompt.nextQueries"
              :key="index"
              @click="onClick(nextQuery)"
              :class="[
                'x-button',
                { 'x-selected': selectedNextQuery === nextQuery },
                nextQueryButtonClass
              ]"
            >
              <slot name="next-query" :nextQuery="nextQuery">
                <span>{{ nextQuery }}</span>
                <CrossTinyIcon v-if="selectedNextQuery === nextQuery" class="x-icon" />
                <PlusIcon v-else class="x-icon" />
              </slot>
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

  /**
   * This component shows a suggested related prompt with the associated next queries.
   * It allows to select one of the next query and show it.
   *
   * It provide slots to customize the header, the next queries list,
   * the individual next query inside the list and the selected query.
   *
   * @public
   */
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
        default: 'x-button-outlined'
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
<style lang="css" scoped>
  .x-related-prompt__info {
    display: flex;
    flex-direction: column;
  }

  .x-related-prompt__sliding-panel-content {
    display: flex;
    gap: 8px;
  }
</style>
