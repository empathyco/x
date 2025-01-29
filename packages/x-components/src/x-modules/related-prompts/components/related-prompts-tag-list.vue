<template>
  <SlidingPanel
    :reset-on-content-change="false"
    :button-class="buttonClass"
    :scroll-container-class="[
      selectedPromptIndex === -1
        ? 'desktop:x-sliding-panel-fade desktop:x-sliding-panel-fade-sm'
        : '',
      'x-h-full x-relative'
    ]"
  >
    <template #sliding-panel-left-button>
      <slot name="sliding-panel-left-button" />
    </template>
    <transition-group
      @enter="onEnter"
      @leave="onLeave"
      class="x-flex x-gap-16 x-min-w-full"
      :css="false"
      tag="div"
    >
      <RelatedPrompt
        v-for="{ colorClass, index, ...relatedPrompt } in visibleRelatedPrompts"
        ref="relatedPromptComponents"
        :key="relatedPrompt.suggestionText"
        @click="onSelect(index)"
        :related-prompt="relatedPrompt"
        :selected="isSelected(index)"
        class="x-h-full"
        :class="[relatedPromptClass, colorClass]"
        :data-index="index"
        :disabled="isAnimating"
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
  import { RelatedPrompt as RelatedPromptModel } from '@empathyco/x-types';
  import { computed, defineComponent, PropType, ref } from 'vue';
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
      relatedPromptClass: String,
      tagColors: {
        type: Array as PropType<string[]>,
        default: () => ['x-bg-amber-100', 'x-bg-amber-200', 'x-bg-amber-300']
      },
      animationDurationInMs: {
        type: Number,
        default: 700
      }
    },
    setup(props) {
      const x = use$x();
      const { relatedPrompts, selectedPrompt: selectedPromptIndex } = useState('relatedPrompts', [
        'relatedPrompts',
        'selectedPrompt'
      ]);

      const relatedPromptComponents = ref<InstanceType<typeof RelatedPrompt>[]>([]);
      const relatedPromptElements = computed<HTMLElement[]>(() =>
        relatedPromptComponents.value.map(component => component.$el)
      );
      const initialOffsetLefts: Record<number, number> = {};

      const isAnimating = ref(false);
      const singleAnimationDurationInMs = computed(
        () => props.animationDurationInMs / (relatedPrompts.value.length - 1)
      );

      const coloredRelatedPrompts = computed(() =>
        (relatedPrompts.value as RelatedPromptModel[]).map(
          (relatedPrompt: RelatedPromptModel, index: number) => ({
            ...relatedPrompt,
            colorClass: props.tagColors[index % props.tagColors.length],
            index
          })
        )
      );

      const visibleRelatedPrompts = computed(() => {
        return selectedPromptIndex.value !== -1
          ? [coloredRelatedPrompts.value[selectedPromptIndex.value]]
          : coloredRelatedPrompts.value;
      });

      let timeOutId: number;
      const resetRelatedPromptsStyle = () => {
        if (timeOutId) {
          clearTimeout(timeOutId);
        }
        isAnimating.value = true;
        timeOutId = +setTimeout(() => {
          isAnimating.value = false;

          relatedPromptElements.value.forEach(element => {
            Object.keys(element.style).forEach(property => {
              if (property !== 'width') {
                element.style.removeProperty(property);
              }
            });
          });
        }, props.animationDurationInMs);
      };

      const onSelect = (selectedIndex: number): void => {
        resetRelatedPromptsStyle();

        const selected: HTMLElement = relatedPromptElements.value.find(
          element => Number.parseInt(element.getAttribute('data-index')!) === selectedIndex
        )!;
        selected.style.transition = 'all';
        selected.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;

        if (relatedPromptElements.value.length === relatedPrompts.value.length) {
          relatedPromptElements.value.forEach(element => {
            const index = Number.parseInt(element.getAttribute('data-index')!);
            initialOffsetLefts[index] = element.offsetLeft;
            element.style.left = `${element.offsetLeft}px`;
            element.style.top = '0px';
            element.style.opacity = '1';
          });

          relatedPromptElements.value.forEach(element => {
            element.style.position = 'absolute';
          });

          selected.style.transitionDelay = `${
            (relatedPrompts.value.length - 2) * singleAnimationDurationInMs.value
          }ms`;

          requestAnimationFrame(() => {
            const maxWidth = getComputedStyle(selected).maxWidth;
            selected.style.setProperty(
              'width',
              `${maxWidth !== 'none' ? maxWidth : '100%'}`,
              'important'
            );
            selected.style.left = '0px';
          });
        } else {
          selected.style.removeProperty('width');
          selected.style.position = 'absolute';
          selected.style.left = '0px';
          selected.style.top = '0px';

          requestAnimationFrame(() => {
            selected.style.left = `${initialOffsetLefts[selectedIndex]}px`;
          });
        }

        x.emit('UserSelectedARelatedPrompt', selectedIndex);
      };

      const onEnter = (el: Element, done: () => void) => {
        const element = el as HTMLElement;
        const selectedIndex = Number.parseInt(
          relatedPromptElements.value[0].getAttribute('data-index')!
        );
        const index = Number.parseInt(element.getAttribute('data-index')!);

        element.style.transition = 'all';
        element.style.transitionDelay = `${
          (index < selectedIndex ? index : index - 1) * singleAnimationDurationInMs.value
        }ms`;
        element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;
        element.style.position = 'absolute';
        element.style.left = `${initialOffsetLefts[index]}px`;
        element.style.opacity = '0';
        element.style.top = '5px';
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.top = '0px';
          done();
        });
      };

      const onLeave = (el: Element, done: () => void) => {
        const element = el as HTMLElement;
        element.style.transitionDelay = `${
          (relatedPrompts.value.length - relatedPromptComponents.value.length - 1) *
          singleAnimationDurationInMs.value
        }ms`;
        element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;

        requestAnimationFrame(() => {
          element.style.opacity = '0';
          element.style.top = '5px';
        });
        setTimeout(() => {
          done();
        }, props.animationDurationInMs);
      };

      const isSelected = (index: number): boolean => selectedPromptIndex.value === index;

      return {
        isSelected,
        onSelect,
        onEnter,
        onLeave,
        selectedPromptIndex,
        visibleRelatedPrompts,
        relatedPromptComponents,
        isAnimating
      };
    }
  });
</script>
