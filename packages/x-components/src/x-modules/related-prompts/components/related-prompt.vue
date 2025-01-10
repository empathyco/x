<template>
  <div
    @click="toggleSuggestion(promptId)"
    @keydown="toggleSuggestion(promptId)"
    class="x-related-prompt__button"
    :class="[{ 'x-related-prompt-selected__button': isSelected }]"
    role="button"
    aria-pressed="true"
    tabindex="0"
  >
    <slot name="related-prompt-button-info">
      <div class="x-related-prompt__button-info">
        <span
          class="x-typewritter-initial"
          :class="[{ 'x-typewritter-animation': isPromptVisible }]"
          :style="{
            animationDelay: `${index * 0.4 + 0.05}s`,
            '--suggestion-text-length': relatedPrompt.suggestionText.length
          }"
        >
          {{ relatedPrompt.suggestionText }}
        </span>
      </div>
      <CrossTinyIcon v-if="isSelected" class="x-icon-lg" />
      <PlusIcon v-else class="x-icon-lg" />
    </slot>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
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
      isPromptVisible: {
        type: Boolean,
        default: false
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      promptId: {
        type: String,
        required: true
      },
      query: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const x = use$x();

      const queryRelatedPrompts = useState('relatedPrompts', ['relatedPrompts']).relatedPrompts;

      const relatedPrompts = computed(
        (): RelatedPrompt[] => queryRelatedPrompts.value[props.query]?.relatedPromptsProducts
      );

      const index = relatedPrompts.value.findIndex(
        relatedPrompt => relatedPrompt.id === props.promptId
      );
      const toggleSuggestion = (promptId: string): void => {
        x.emit('UserSelectedARelatedPrompt', { promptId, query: props.query });
      };

      return {
        toggleSuggestion,
        index
      };
    }
  });
</script>
