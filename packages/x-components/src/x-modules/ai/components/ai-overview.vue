<template>
  <CollapseHeight>
    <div
      v-show="loading || question"
      class="x-ai-overview"
      :class="{ 'x-ai-overview--expanded': expanded, 'x-ai-overview--loading': loading }"
    >
      <div class="x-ai-overview-main">
        <Fade mode="out-in">
          <span
            v-if="loading"
            class="x-ai-overview-title-loading"
            data-test="ai-overview-title-loading"
          >
            <span class="x-ai-overview-title-loading-indicator" />
            <span
              v-typing="{ text: titleLoading, speed: 50 }"
              class="x-ai-overview-title-loading-text"
              data-test="ai-overview-title-loading-text"
            />
          </span>
          <span v-else class="x-ai-overview-title" data-test="ai-overview-title">
            <AIStarIcon class="x-ai-overview-title-icon" />{{ title }}
          </span>
        </Fade>
        <ChangeHeight>
          <div
            v-if="loading"
            class="x-ai-overview-loading-content"
            data-test="ai-overview-loading-content"
          >
            <span v-for="i in 4" :key="i" />
          </div>
          <div v-else class="x-ai-overview-content" data-test="ai-overview-content">
            <span>{{ question?.suggestionText }}</span>
            <p>{{ question?.content.responseText }}</p>
          </div>
        </ChangeHeight>
      </div>
      <CollapseHeight>
        <div v-if="expanded" data-test="ai-overview-slot">
          <slot :question="question">
            <AiQuestionResults v-if="question" :question="question" />
          </slot>
        </div>
      </CollapseHeight>
      <template v-if="!loading && !expanded">
        <div class="x-ai-overview-gradient" data-test="ai-overview-gradient" @click="open" />
        <div class="x-ai-overview-expand-wrapper">
          <button class="x-ai-overview-expand-btn" data-test="ai-overview-expand-btn" @click="open">
            {{ buttonText }}
            <ChevronDownIcon class="x-ai-overview-expand-btn-icon" />
          </button>
        </div>
      </template>
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
import { aiXModule } from '../x-module'
import AiQuestionResults from './ai-question-results.vue'

export default defineComponent({
  directives: {
    typing,
  },
  xModule: aiXModule.name,
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
<style lang="css">
.x-ai-overview {
  @apply x-relative x-rounded-lg x-bg-lead-25;
}

.x-ai-overview:not(.x-ai-overview--loading, .x-ai-overview--expanded) {
  @apply x-rounded-b-3xl;
}

.x-ai-overview-main {
  @apply x-p-16 x-rounded-lg;
}

.x-ai-overview-title-loading {
  @apply x-flex x-items-center x-gap-1.5 x-mb-8;
}
.x-ai-overview-title-loading-indicator {
  @apply x-size-3 x-animate-pulse x-rounded-full x-bg-lead-50;
}
.x-ai-overview-title-loading-text {
  @apply x-animate-pulse x-text-xs;
}

.x-ai-overview-title {
  @apply x-flex x-text-sm x-font-bold x-gap-4 x-items-center x-mb-8;
}
.x-ai-overview-title-icon {
  @apply x-icon x-text-lead-50;
}

.x-ai-overview-loading-content {
  @apply x-flex x-w-full x-flex-col x-gap-4 x-animate-pulse;
}
.x-ai-overview-loading-content > span:first-child {
  @apply x-h-16 x-w-full x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75;
}
.x-ai-overview-loading-content > span:nth-child(2) {
  @apply x-h-16 x-w-3/4 x-rounded-full x-bg-gradient-to-r x-from-lead-75 x-to-lead-50 x-opacity-50;
}
.x-ai-overview-loading-content > span:nth-child(3) {
  @apply x-h-16 x-w-11/12 x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75;
}
.x-ai-overview-loading-content > span:nth-child(4) {
  @apply x-h-16 x-w-1/2 x-rounded-full x-bg-gradient-to-r x-from-lead-50 x-to-lead-75 x-opacity-75;
}

.x-ai-overview-content {
  @apply x-flex x-flex-col x-text-left x-leading-5 x-gap-2;
}
.x-ai-overview-content span {
  @apply x-font-medium;
}

.x-ai-overview-gradient {
  @apply x-cursor-pointer x-content-none x-absolute x-w-full x-h-80 x-bottom-5 x-bg-gradient-to-b x-from-transparent x-to-lead-25;
}

.x-ai-overview-expand-wrapper {
  @apply x-flex x-relative x-z-[1];
}
.x-ai-overview-expand-btn {
  @apply x-button x-button-outlined x-rounded-full x-w-full;
}
.x-ai-overview-expand-btn-icon {
  @apply x-icon;
}
</style>
