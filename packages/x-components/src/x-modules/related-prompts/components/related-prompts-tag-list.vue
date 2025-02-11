<template>
  <SlidingPanel
    :key="x.query.search"
    :reset-on-content-change="false"
    :button-class="buttonClass"
    scroll-container-class="x-related-prompts-tag-list-scroll-container"
  >
    <template #sliding-panel-left-button>
      <slot name="sliding-panel-left-button" />
    </template>
    <transition-group
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
      class="x-related-prompts-tag-list"
      :css="false"
      tag="div"
      appear
    >
      <RelatedPrompt
        v-for="{ colorClass, index, ...relatedPrompt } in visibleRelatedPrompts"
        ref="relatedPromptComponents"
        :key="relatedPrompt.suggestionText"
        @click="onSelect(index)"
        :related-prompt="relatedPrompt"
        :selected="isSelected(index)"
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
  import { computed, defineComponent, PropType, ref, watch } from 'vue';
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

      const clickedRelatedPromptIndex = ref<number | null>(null);
      const initialOffsetLefts: Record<number, number> = {};
      const isAnimating = ref(false);
      const relatedPromptComponents = ref<InstanceType<typeof RelatedPrompt>[]>([]);

      const relatedPromptElements = computed<HTMLElement[]>(() =>
        relatedPromptComponents.value
          .map(component => component.$el)
          .sort(
            (a: HTMLElement, b: HTMLElement) =>
              Number.parseInt(b.getAttribute('data-index')!) -
              Number.parseInt(a.getAttribute('data-index')!)
          )
      );

      // The duration of a single animation (enter or leave) in milliseconds
      // if a related prompt is clicked (clickedRelatedPromptIndex.value !== null), the duration is divided by the number of related
      // prompts -1 (the clicked one is synchronized with the last one to leave or the first one to enter)
      const singleAnimationDurationInMs = computed(
        () =>
          props.animationDurationInMs /
          (clickedRelatedPromptIndex.value !== null
            ? relatedPrompts.value.length - 1
            : relatedPrompts.value.length)
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
          clickedRelatedPromptIndex.value = null;

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

        clickedRelatedPromptIndex.value = selectedIndex;
        const selected: HTMLElement = relatedPromptElements.value.find(
          element => Number.parseInt(element.getAttribute('data-index')!) === selectedIndex
        )!;

        // selectedPromptIndex.value === -1 ? 'SELECTING' : 'DESELECTING'
        if (selectedPromptIndex.value === -1) {
          // Prepare all the elements for the leave animation (~ 'beforeLeave' hook). Remember the elements are
          // sorted in descending order by index.
          relatedPromptElements.value.forEach(element => {
            const index = Number.parseInt(element.getAttribute('data-index')!);

            initialOffsetLefts[index] = element.offsetLeft;
            element.style.left = `${element.offsetLeft}px`;
            element.style.position = 'absolute';
            element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;

            if (index !== selectedIndex) {
              element.style.opacity = '1';
              element.style.transitionDelay = `${
                (index < selectedIndex ? index : index - 1) * singleAnimationDurationInMs.value
              }ms`;
            }
          });

          // Synchronize the transition delay of the selected element with the last
          // element to leave
          selected.style.transitionDelay = `${
            (relatedPrompts.value.length > 1 ? relatedPrompts.value.length - 2 : 0) *
            singleAnimationDurationInMs.value
          }ms`;

          // Trigger the animation (selecting) for the selected element
          requestAnimationFrame(() => {
            const maxWidth = getComputedStyle(selected).maxWidth;

            selected.style.left = '0px';
            selected.style.setProperty(
              'width',
              `${maxWidth !== 'none' ? maxWidth : '100%'}`,
              'important'
            );
          });
        } else {
          selected.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;
          selected.style.left = '0px';
          selected.style.position = 'absolute';

          // Trigger the animation (deselecting) for the selected element
          selected.style.removeProperty('width');
          requestAnimationFrame(() => {
            selected.style.left = `${initialOffsetLefts[selectedIndex]}px`;
          });
        }

        x.emit('UserSelectedARelatedPrompt', selectedIndex);
      };

      const onBeforeEnter = (el: Element) => {
        const element = el as HTMLElement;
        const index = Number.parseInt(element.getAttribute('data-index')!);

        // Prepare the element for the enter animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(5px)';
        element.style.transitionDelay = `${
          (clickedRelatedPromptIndex.value !== null && index > clickedRelatedPromptIndex.value
            ? index - 1
            : index) * singleAnimationDurationInMs.value
        }ms`;
        element.style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;
      };

      const onEnter = (el: Element, done: () => void) => {
        const element = el as HTMLElement;
        const index = Number.parseInt(element.getAttribute('data-index')!);

        // Also part of the preparation for the enter animation, but it needs to be done
        // once the element is inserted in DOM (if not the offsetLeft will be always 0)
        element.style.left = `${initialOffsetLefts[index] ?? element.offsetLeft}px`;

        // trigger enter animation
        requestAnimationFrame(() => {
          element.style.opacity = '1';
          element.style.position = 'absolute';
          element.style.transform = 'translateY(0)';
        });

        done();
      };

      const onLeave = (el: Element, done: () => void) => {
        const element = el as HTMLElement;

        // trigger leave animation
        requestAnimationFrame(() => {
          element.style.opacity = '0';
          element.style.transform = 'translateY(5px)';
        });

        // Wait for the animation to finish (done() exectution extracts the element from the DOM)
        setTimeout(done, props.animationDurationInMs);
      };

      const isSelected = (index: number): boolean => selectedPromptIndex.value === index;

      // Changing the query will trigger the appear animation, so we need to reset the
      // style after it finishes
      watch(() => x.query.search, resetRelatedPromptsStyle, { immediate: true });

      return {
        isSelected,
        onSelect,
        onBeforeEnter,
        onEnter,
        onLeave,
        selectedPromptIndex,
        visibleRelatedPrompts,
        relatedPromptComponents,
        isAnimating,
        x
      };
    }
  });
</script>
<style lang="css">
  .x-related-prompts-tag-list-scroll-container {
    height: 100%;
    position: relative;
  }
  .x-related-prompts-tag-list {
    display: flex;
    gap: 16px;
    min-width: 100%;
  }
</style>
