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
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @before-enter="onBeforeEnter"
      class="x-flex x-gap-16 x-min-w-full"
      tag="div"
    >
      <RelatedPrompt
        v-for="{ colorClass, index, ...relatedPrompt } in visibleRelatedPrompts"
        ref="relatedPromptElements"
        :key="relatedPrompt.suggestionText"
        @click="onSelect(index)"
        :related-prompt="relatedPrompt"
        :selected="isSelected(index)"
        class="x-h-full"
        :class="[relatedPromptClass, colorClass]"
        :data-index="index"
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
      relatedPromptColorClasses: {
        type: Array as PropType<string[]>,
        default: () => ['x-bg-neutral-90', 'x-bg-neutral-75']
      },
      relatedPromptClass: String,
      animationDurationInMs: {
        type: Number,
        default: 3000
      }
    },
    setup(props) {
      const x = use$x();
      const { relatedPrompts, selectedPrompt: selectedPromptIndex } = useState('relatedPrompts', [
        'relatedPrompts',
        'selectedPrompt'
      ]);

      const relatedPromptElements = ref<HTMLElement[]>([]);
      const initialOffsetLefts: Record<number, number> = {};

      const singleAnimationDurationInMs = computed(
        () => props.animationDurationInMs / (relatedPrompts.value.length - 1)
      );

      const coloredRelatedPrompts = computed(() =>
        (relatedPrompts.value as RelatedPromptModel[]).map(
          (relatedPrompt: RelatedPromptModel, index: number) => ({
            ...relatedPrompt,
            colorClass:
              props.relatedPromptColorClasses[index % props.relatedPromptColorClasses.length],
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

        timeOutId = setTimeout(() => {
          console.log('reset', Date.now());

          relatedPromptElements.value.forEach(relatedPromptElement => {
            Object.keys((relatedPromptElement.$el as HTMLElement).style).forEach(property => {
              (relatedPromptElement.$el as HTMLElement).style.removeProperty(property);
            });
          });
        }, props.animationDurationInMs) as unknown as number;
      };

      const onSelect = (selectedIndex: number): void => {
        resetRelatedPromptsStyle();
        console.log('click', Date.now());

        const selectedRelatedPromptElement = relatedPromptElements.value.find(
          relatedPromptElement =>
            Number.parseInt((relatedPromptElement.$el as Element).getAttribute('data-index')!) ===
            selectedIndex
        );
        // const { width: selectedRelatedPromptWidth, maxWidth: selectedRelatedPromptMaxWidth } =
        //   getComputedStyle(selectedRelatedPromptElement!.$el as HTMLElement);

        (selectedRelatedPromptElement!.$el as HTMLElement).style.transition = 'all';
        (
          selectedRelatedPromptElement!.$el as HTMLElement
        ).style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;

        if (relatedPromptElements.value.length === relatedPrompts.value.length) {
          relatedPromptElements.value.forEach(relatedPromptElement => {
            const index = Number.parseInt(
              (relatedPromptElement.$el as Element).getAttribute('data-index')!
            );
            const offsetLeft = relatedPromptElement.$el.offsetLeft as number;

            initialOffsetLefts[index] = offsetLeft;
            relatedPromptElement.$el.style.left = `${offsetLeft}px`;
            relatedPromptElement.$el.style.top = '0px';
            relatedPromptElement.$el.style.opacity = '1';
          });

          relatedPromptElements.value.forEach(relatedPromptElement => {
            relatedPromptElement.$el.style.position = 'absolute';
          });

          selectedRelatedPromptElement!.$el.style.transitionDelay = `${
            (relatedPrompts.value.length - 2) * singleAnimationDurationInMs.value
          }ms`;

          // selectedRelatedPromptElement!.$el.style.minWidth = selectedRelatedPromptWidth;

          requestAnimationFrame(() => {
            selectedRelatedPromptElement!.$el.style.left = '0px';
            // if (selectedRelatedPromptMaxWidth) {
            //   selectedRelatedPromptElement!.$el.style.minWidth = selectedRelatedPromptMaxWidth;
            // }
          });
        } else {
          // selectedRelatedPromptElement!.$el.style.maxWidth = selectedRelatedPromptWidth;
          selectedRelatedPromptElement!.$el.style.position = 'absolute';
          selectedRelatedPromptElement!.$el.style.left = '0px';
          selectedRelatedPromptElement!.$el.style.top = '0px';

          requestAnimationFrame(() => {
            selectedRelatedPromptElement!.$el.style.left = `${initialOffsetLefts[selectedIndex]}px`;
            // selectedRelatedPromptElement!.$el.style.maxWidth = selectedRelatedPromptWidth;
          });
        }

        x.emit('UserSelectedARelatedPrompt', selectedIndex);
      };

      const onAfterEnter = (el: Element) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.top = '0px';
      };

      const onBeforeLeave = (el: Element) => {
        (el as HTMLElement).style.transitionDelay = `${
          (relatedPrompts.value.length - relatedPromptElements.value.length - 1) *
          singleAnimationDurationInMs.value
        }ms`;
        (el as HTMLElement).style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.top = '5px';
      };

      const onBeforeEnter = (el: Element) => {
        const selectedIndex = Number.parseInt(
          (relatedPromptElements.value[0].$el as Element).getAttribute('data-index')!
        );
        const index = Number.parseInt(el.getAttribute('data-index')!);

        (el as HTMLElement).style.transition = 'all';
        (el as HTMLElement).style.transitionDelay = `${
          (index < selectedIndex ? index : index - 1) * singleAnimationDurationInMs.value
        }ms`;
        console.log(
          'Delay',
          index,
          (index < selectedIndex ? index : index - 1) * singleAnimationDurationInMs.value,
          Date.now()
        );

        (el as HTMLElement).style.transitionDuration = `${singleAnimationDurationInMs.value}ms`;
        (el as HTMLElement).style.position = 'absolute';
        (el as HTMLElement).style.left = `${initialOffsetLefts[index]}px`;
        (el as HTMLElement).style.top = '5px';
        (el as HTMLElement).style.opacity = '0';
      };

      const isSelected = (index: number): boolean => selectedPromptIndex.value === index;

      return {
        isSelected,
        onSelect,
        onAfterEnter,
        onBeforeLeave,
        onBeforeEnter,
        selectedPromptIndex,
        visibleRelatedPrompts,
        relatedPromptElements
      };
    }
  });
</script>
