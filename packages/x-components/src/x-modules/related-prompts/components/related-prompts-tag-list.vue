<template>
  <div>
    <template v-if="$slots.header">
      <slot name="header" />
    </template>
    <SlidingPanel
      :reset-on-content-change="true"
      :button-class="buttonClass"
      :scroll-container-class="
        selectedPrompt === -1 ? 'desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm' : ''
      "
    >
      <template #sliding-panel-left-button>
        <slot name="sliding-panel-left-button" />
      </template>

      <slot name="sliding-panel-content">
        <div
          ref="slidingPanelContent"
          class="x-related-prompt__sliding-panel-content"
          :class="{ 'x-related-prompt__sliding-panel-content-selected': selectedPrompt !== -1 }"
        >
          <div
            v-for="(suggestion, index) in relatedPrompts"
            :key="index"
            :style="{
              animationDelay: `${index * 0.4 + 0.05}s`
            }"
            class="x-related-prompt x-staggered-initial"
            :class="[
              { 'x-staggered-animation': arePromptsVisible },
              { 'x-hidden': hidePrompt(index) },
              { 'x-related-prompt-selected': isSelected(index) }
            ]"
            data-test="related-prompt-item"
          >
            <slot
              name="related-prompt-button"
              v-bind="{ suggestion, index, arePromptsVisible, isSelected }"
            >
              <RelatedPrompt
                :related-prompt="suggestion"
                :index="index"
                :is-prompt-visible="arePromptsVisible"
                :is-selected="isSelected(index)"
              />
            </slot>
          </div>
        </div>
      </slot>

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
  import { useState } from '../../../composables/index';
  import RelatedPrompt from './related-prompt.vue';

  export default defineComponent({
    name: 'RelatedPromptsTagList',
    xModule: relatedPromptsXModule.name,
    components: { RelatedPrompt, SlidingPanel },
    props: {
      buttonClass: String
    },
    setup() {
      const { relatedPrompts, selectedPrompt } = useState('relatedPrompts', [
        'relatedPrompts',
        'selectedPrompt'
      ]);

      const slidingPanelContent = ref<Element>();
      const arePromptsVisible = ref(false);

      const observer = new IntersectionObserver(([entry]) => {
        arePromptsVisible.value = entry.isIntersecting;
      });

      onMounted(() => {
        observer.observe(slidingPanelContent.value as Element);
      });

      onUnmounted(() => {
        observer.disconnect();
      });

      const isSelected = (index: number): boolean => selectedPrompt.value === index;

      const hidePrompt = (index: number): boolean =>
        selectedPrompt.value !== -1 && selectedPrompt.value !== index;

      return {
        arePromptsVisible,
        hidePrompt,
        isSelected,
        relatedPrompts,
        selectedPrompt,
        slidingPanelContent
      };
    }
  });
</script>

<style lang="css">
  .x-related-prompt__sliding-panel-content {
    display: flex;
    gap: 8px;
  }

  .x-related-prompt__sliding-panel-content-selected {
    width: calc(100%);
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
