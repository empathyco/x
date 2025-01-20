<template>
  <SlidingPanel
    :reset-on-content-change="true"
    :button-class="buttonClass"
    :scroll-container-class="
      selectedPromptIndex === -1
        ? 'desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm'
        : ''
    "
  >
    <template #sliding-panel-left-button>
      <slot name="sliding-panel-left-button" />
    </template>
    <transition-group
      class="x-flex x-gap-16"
      leave-to-class="x-opacity-0 -x-z-1"
      enter-from-class="x-opacity-0"
      @before-enter="applyStaggerEffect"
      @before-leave="applyStaggerEffect"
      tag="div"
    >
      <RelatedPrompt
        v-for="({ colorClass, ...relatedPrompt }, index) in visibleRelatedPrompts"
        :key="relatedPrompt.suggestionText"
        :related-prompt="relatedPrompt"
        :selected="isSelected(relatedPrompt.suggestionText)"
        class="x-h-full x-transition-all x-duration-300"
        :class="[relatedPromptClass, colorClass]"
        :data-index="index"
        @click="onSelect(relatedPrompt.suggestionText)"
        @keydown="onSelect(relatedPrompt.suggestionText)"
      >
        <template #extra-content>
          <slot name="related-prompt-extra-content" v-bind="{ relatedPrompt }" />
        </template>
      </RelatedPrompt>
    </transition-group>
    <template #sliding-panel-right-button>
      <slot name="sliding-panel-right-button" />
    </template>
  </SlidingPanel>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import SlidingPanel from '../../../components/sliding-panel.vue';
  import { relatedPromptsXModule } from '../x-module';
  import { use$x, useState } from '../../../composables';
  import RelatedPrompt from './related-prompt.vue';

  export default defineComponent({
    name: 'RelatedPromptsTagList',
    xModule: relatedPromptsXModule.name,
    components: { RelatedPrompt, SlidingPanel },
    props: {
      buttonClass: String,
      relatedPromptColorClasses: {
        type: Array as PropType<String[]>,
        default: () => ['x-bg-neutral-90', 'x-bg-neutral-75']
      },
      relatedPromptClass: String
    },
    setup(props) {
      const x = use$x();

      const { relatedPrompts, selectedPrompt: selectedPromptIndex } = useState('relatedPrompts', [
        'relatedPrompts',
        'selectedPrompt'
      ]);

      const visibleRelatedPrompts = computed(() => {
        const coloredRelatedPrompts = relatedPrompts.value.map((relatedPrompt, index) => ({
          ...relatedPrompt,
          colorClass:
            props.relatedPromptColorClasses[index % props.relatedPromptColorClasses.length]
        }));
        console.log(
          selectedPromptIndex.value !== -1
            ? [coloredRelatedPrompts[selectedPromptIndex.value]]
            : coloredRelatedPrompts
        );
        return selectedPromptIndex.value !== -1
          ? [coloredRelatedPrompts[selectedPromptIndex.value]]
          : coloredRelatedPrompts;
      });

      const onSelect = (suggestionText: string): void => {
        const index = relatedPrompts.value.findIndex(
          relatedPrompt => relatedPrompt.suggestionText === suggestionText
        );
        x.emit('UserSelectedARelatedPrompt', index);
      };

      function applyStaggerEffect(el: Element) {
        const index = Number.parseInt(el.getAttribute('data-index')!);
        const delayInMs =
          index === selectedPromptIndex.value ? relatedPrompts.value.length * 0.4 : index * 0.4;
        (el as HTMLElement).style.transitionDelay = `${delayInMs * 1000}ms`;
      }

      //TODO fix isSelected
      const isSelected = (index: number): boolean => selectedPromptIndex.value === index;

      return {
        isSelected,
        onSelect,
        applyStaggerEffect,
        selectedPromptIndex,
        visibleRelatedPrompts
      };
    }
  });
</script>
