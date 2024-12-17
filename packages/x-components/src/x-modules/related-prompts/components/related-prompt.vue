<template>
  <button
    @click="toggleSuggestion(index)"
    class="x-related-prompt__button"
    :class="[{ 'x-related-prompt-selected__button': isSelected(index) }]"
  >
    <slot name="related-prompt-button-info">
      <div class="x-related-prompt__button-info">
        <span
          class="x-typewritter-initial"
          :class="[{ 'x-typewritter-animation': isVisible }]"
          :style="{
            animationDelay: `${index * 0.4 + 0.05}s`,
            '--suggestion-text-length': relatedPrompt.suggestionText.length
          }"
        >
          {{ relatedPrompt.suggestionText }}
        </span>
      </div>
      <CrossTinyIcon v-if="isSelected(index)" class="x-icon-lg" />
      <PlusIcon v-else class="x-icon-neutral-80 x-icon-lg" />
    </slot>
  </button>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { RelatedPrompt } from '@empathyco/x-types';
  import { relatedPromptsXModule } from '../x-module';
  import CrossTinyIcon from '../../../components/icons/cross-tiny.vue';
  import PlusIcon from '../../../components/icons/plus.vue';
  import { use$x, useState } from '../../../composables/index';

  /**
   * This component shows a suggested related prompt.
   *
   * It provides a slot to customize the related prompt button information.
   *
   * @public
   */
  export default defineComponent({
    name: 'RelatedPrompt',
    components: {
      CrossTinyIcon,
      PlusIcon
    },
    xModule: relatedPromptsXModule.name,
    props: {
      relatedPrompt: {
        type: Object as PropType<RelatedPrompt>,
        required: true
      },
      isVisible: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        required: true
      }
    },
    setup() {
      const x = use$x();
      const { selectedPrompt } = useState('relatedPrompts', ['selectedPrompt']);

      const toggleSuggestion = (index: number): void => {
        x.emit('UserSelectedARelatedPrompt', index);
      };

      const isSelected = (index: number): boolean => selectedPrompt.value === index;

      return {
        isSelected,
        selectedPrompt,
        toggleSuggestion
      };
    }
  });
</script>
<style lang="css"></style>
