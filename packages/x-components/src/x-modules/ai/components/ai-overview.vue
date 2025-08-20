<template>
  <div class="x-relative x-rounded-lg" :class="{ 'x-bg-lead-25': expanded }">
    <div class="x-p-16 x-rounded-lg x-bg-gradient-to-b x-from-lead-25 x-from-85% x-to-transparent">
      <Fade mode="out-in">
        <span v-if="loading" class="x-flex x-items-center x-gap-1.5 x-mb-8">
          <span class="x-size-3 x-animate-pulse x-rounded-full x-bg-lead-50" />
          <span
            v-typing="{ text: 'Generating with Empathy AI', speed: 50 }"
            class="animate-pulse x-text-xs"
          />
        </span>
        <span v-else class="x-flex x-text-sm x-font-bold x-gap-4 x-items-center x-mb-8">
          <AIStarIcon class="x-icon x-text-lead-50" />Empathy AI Overview
        </span>
      </Fade>
      <ChangeHeight>
        <div v-if="loading" class="x-flex x-w-full x-flex-col x-gap-4 x-animate-pulse">
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
        <div v-else>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a
          long established fact that a reader will be distracted by the readable content of a page
          when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
          normal distribution of letters, as opposed to using 'Content here, content here', making
          it look like readable English. Many desktop publishing packages and web page editors now
          use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover
          many web sites still in their infancy. Various versions have evolved over the years,
          sometimes by accident, sometimes on purpose (injected humour and the like).
        </div>
      </ChangeHeight>
    </div>
    <CollapseHeight>
      <div v-if="expanded">
        <slot>
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed to using 'Content here, content
          here', making it look like readable English. Many desktop publishing packages and web page
          editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
          will uncover many web sites still in their infancy. Various versions have evolved over the
          years, sometimes by accident, sometimes on purpose (injected humour and the like).
        </slot>
      </div>
    </CollapseHeight>
    <div v-if="!expanded" class="x-flex">
      <button class="x-button x-button-outlined x-rounded-full x-w-full" @click="expanded = true">
        Show more
        <ChevronDownIcon class="x-icon" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ChangeHeight, CollapseHeight, Fade } from '../../../components'
import { AIStarIcon, ChevronDownIcon } from '../../../components/icons'
import { typing } from '../../../directives'

export default defineComponent({
  directives: {
    typing,
  },
  components: {
    ChangeHeight,
    AIStarIcon,
    ChevronDownIcon,
    CollapseHeight,
    Fade,
  },
  setup(props) {
    const expanded = ref(false)
    const loading = ref(true)

    setTimeout(() => {
      loading.value = false
    }, 3000)

    return {
      expanded,
      loading,
      props,
    }
  },
})
</script>
