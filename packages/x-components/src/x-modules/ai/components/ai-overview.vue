<template>
  <CollapseHeight>
    <div
      v-show="loading || question"
      class="x-relative x-rounded-lg"
      :class="{ 'x-bg-lead-25': expanded }"
      data-test="ai-overview-root"
    >
      <div
        class="x-p-16 x-rounded-lg"
        :class="[
          loading
            ? 'x-bg-lead-25'
            : 'x-bg-gradient-to-b x-from-lead-25 x-from-85% x-to-transparent',
        ]"
        data-test="ai-overview-main"
      >
        <Fade mode="out-in">
          <span
            v-if="loading"
            class="x-flex x-items-center x-gap-1.5 x-mb-8"
            data-test="ai-overview-loading"
          >
            <span class="x-size-3 x-animate-pulse x-rounded-full x-bg-lead-50" />
            <span
              v-typing="{ text: titleLoading, speed: 50 }"
              class="animate-pulse x-text-xs"
              data-test="ai-overview-title-loading"
            />
          </span>
          <span
            v-else
            class="x-flex x-text-sm x-font-bold x-gap-4 x-items-center x-mb-8"
            data-test="ai-overview-title"
          >
            <AIStarIcon class="x-icon x-text-lead-50" />{{ title }}
          </span>
        </Fade>
        <ChangeHeight>
          <div
            v-if="loading"
            class="x-flex x-w-full x-flex-col x-gap-4 x-animate-pulse"
            data-test="ai-overview-loading-content"
          >
            <span
              class="x-h-16 x-w-full x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75"
            />
            <span
              class="x-h-16 x-w-3/4 x-rounded-full x-bg-gradient-to-r x-from-lead-75 x-to-lead-50 x-opacity-50"
            />
            <span
              class="x-h-16 x-w-11/12 x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75"
            />
            <span
              class="x-h-16 x-w-1/2 x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75 x-opacity-75"
            />
          </div>
          <div
            v-else
            class="x-flex x-flex-col x-text-left x-leading-5 x-gap-2"
            data-test="ai-overview-content"
          >
            <h2 class="x-font-medium">
              {{ question?.suggestionText }}
            </h2>
            <p>
              {{ question?.content.responseText }}
            </p>
          </div>
        </ChangeHeight>
      </div>
      <CollapseHeight>
        <div v-if="expanded" data-test="ai-overview-slot">
          <slot>
            <AiQuestionResults v-if="question" :question="question" />
          </slot>
        </div>
      </CollapseHeight>
      <div v-if="!loading && !expanded" class="x-flex">
        <button
          class="x-button x-button-outlined x-rounded-full x-w-full"
          data-test="ai-overview-expand-btn"
          @click="open"
        >
          {{ buttonText }}
          <ChevronDownIcon class="x-icon" />
        </button>
      </div>
    </div>
  </CollapseHeight>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, ref, watch } from 'vue'
import { ChangeHeight, CollapseHeight, Fade } from '../../../components'
import { AIStarIcon, ChevronDownIcon } from '../../../components/icons'
import { useGetter } from '../../../composables'
import { typing } from '../../../directives'
import AiQuestionResults from './ai-question-results.vue'

export default defineComponent({
  directives: {
    typing,
  },
  components: {
    AiQuestionResults,
    ChangeHeight,
    AIStarIcon,
    ChevronDownIcon,
    CollapseHeight,
    Fade,
  },
  props: {
    /**
     * The text displayed when the question ended loading
     *
     * @public
     */
    title: {
      type: String as PropType<string>,
      default: 'Empathy AI Overview',
    },
    /**
     * The text displayed when the question is loading.
     *
     * @public
     */
    titleLoading: {
      type: String as PropType<string>,
      default: 'Generating with Empathy AI',
    },
    /**
     * The text displayed on the expand button.
     *
     * @public
     */
    buttonText: {
      type: String as PropType<string>,
      default: 'Show more',
    },
  },
  setup() {
    const { currentQuestion: question, currentQuestionLoading: loading } = useGetter('ai')

    const expanded = ref(false)

    function open() {
      expanded.value = true
    }

    watch(loading, () => {
      if (loading.value) {
        expanded.value = false
      }
    })

    return {
      expanded,
      question,
      open,
      loading,
    }
  },
})
</script>
