<template>
  <div>
    <template v-if="$slots.header">
      <slot name="header" />
    </template>
    <SlidingPanel
      :reset-on-content-change="true"
      :scroll-container-class="
        selectedPrompt === -1 ? 'desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm' : ''
      "
    >
      <template #sliding-panel-left-button>
        <slot name="sliding-panel-left-button" />
      </template>

      <div
        ref="slidingPanelContent"
        class="x-related-prompt__sliding-panel-content"
        :class="{ 'x-w-[calc(100%)]': selectedPrompt !== -1 }"
      >
        <div
          v-for="(suggestion, index) in relatedPrompts"
          :key="index"
          :style="{
            animationDelay: `${index * 0.4 + 0.05}s`
          }"
          class="x-related-prompt x-staggered-initial"
          :class="[
            { 'x-staggered-animation': isVisible },
            { 'x-hidden': shouldHideButton(index) },
            { 'x-related-prompt-selected': isSelected(index) }
          ]"
          data-test="related-prompt-item"
        >
          <!-- Suggestion -->
          <button
            @click="toggleSuggestion(index)"
            class="x-related-prompt__button"
            :class="[{ 'x-related-prompt-selected__button': isSelected(index) }]"
          >
            <slot name="related-prompt">
              <div class="x-related-prompt__button-info">
                <span
                  class="x-typewritter-initial"
                  :class="[{ 'x-typewritter-animation': isVisible }]"
                  :style="{
                    animationDelay: `${index * 0.4 + 0.05}s`,
                    '--suggestion-text-length': suggestion.suggestionText.length
                  }"
                >
                  {{ suggestion.suggestionText }}
                </span>
              </div>
              <CrossTinyIcon v-if="isSelected(index)" class="x-icon-lg" />
              <PlusIcon v-else class="x-icon-neutral-80 x-icon-lg" />
            </slot>
          </button>
        </div>
      </div>

      <template #sliding-panel-right-button>
        <slot name="sliding-panel-right-button" />
      </template>
    </SlidingPanel>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import SlidingPanel from '../../../components/sliding-panel.vue';
  import { relatedPromptsXModule } from '../x-module';
  import { CrossTinyIcon, PlusIcon } from '../../../components/index';
  import { use$x, useState } from '../../../composables/index';

  export default defineComponent({
    name: 'RelatedPromptsTagList',
    xModule: relatedPromptsXModule.name,
    components: { SlidingPanel, PlusIcon, CrossTinyIcon },
    setup() {
      const x = use$x();
      const { relatedPrompts, selectedPrompt } = useState('relatedPrompts', [
        'relatedPrompts',
        'selectedPrompt'
      ]);

      const slidingPanelContent = ref<Element>();
      const isVisible = ref(false);

      const observer = new IntersectionObserver(([entry]) => {
        isVisible.value = entry.isIntersecting;
      });

      onMounted(() => {
        observer.observe(slidingPanelContent.value as Element);
      });

      onUnmounted(() => {
        observer.disconnect();
      });

      const toggleSuggestion = (index: number): void => {
        x.emit('UserSelectedARelatedPrompt', index);
      };

      const isSelected = (index: number): boolean => selectedPrompt.value === index;

      const shouldHideButton = (index: number): boolean =>
        selectedPrompt.value !== -1 && selectedPrompt.value !== index;

      return {
        isSelected,
        isVisible,
        relatedPrompts,
        selectedPrompt,
        shouldHideButton,
        slidingPanelContent,
        toggleSuggestion
      };
    }
  });
</script>

<style lang="css">
  .x-related-prompt__sliding-panel-content {
    display: flex;
    gap: 8px;
  }

  .x-related-prompt {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    min-height: 112px;
    height: 100%;
    width: 303px;
  }

  .x-related-prompt-selected {
    width: 100% !important;
    min-height: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    &__button {
      width: 100% !important;
    }
  }

  .x-related-prompt__button {
    display: flex;
    flex-direction: row;
    gap: 12px;
    justify-content: space-between;
    align-items: start;
    text-align: start;
    padding: 16px;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 500ms;
    flex-grow: 1;
    width: 303px;
  }

  .x-related-prompt__button-info {
    display: flex;
    min-height: 32px;
  }

  @media (max-width: 743px) {
    .x-related-prompt {
      width: 204px;
      &__button {
        width: 204px;
      }
    }
  }

  .x-no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .x-no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  .x-typewritter-initial {
    color: #0000;
    background: linear-gradient(-90deg, transparent 5px, #0000 0) 10px 0,
      linear-gradient(#575757 0 0) 0 0;
    background-size: 0 200%;
    -webkit-background-clip: padding-box, text;
    background-clip: padding-box, text;
    background-repeat: no-repeat;
  }

  .x-typewritter-animation {
    animation: typewritter calc(var(--suggestion-text-length) * 0.05s)
      steps(var(--suggestion-text-length)) forwards;
  }

  @keyframes typewritter {
    from {
      background-size: 0 200%;
    }
    to {
      background-size: calc(var(--suggestion-text-length) * 1ch) 200%;
    }
  }

  .x-staggered-initial {
    opacity: 0;
    transform: translateY(20px);
  }

  .x-staggered-animation {
    animation: fadeInUp 0.6s forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
