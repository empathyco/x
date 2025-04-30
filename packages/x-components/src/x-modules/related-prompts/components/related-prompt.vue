<template>
  <button class="x-related-prompt">
    <slot name="related-prompt-extra-content" :related-prompt="relatedPrompt" />
    <span
      v-typing="{ text: relatedPrompt.suggestionText, speed: 50 }"
      class="x-related-prompt-text"
    />
    <component :is="selected ? 'CrossTinyIcon' : 'PlusIcon'" class="x-related-prompt-icon" />
  </button>
</template>
<script lang="ts">
import type { RelatedPrompt } from '@empathyco/x-types'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import CrossTinyIcon from '../../../components/icons/cross-tiny.vue'
import PlusIcon from '../../../components/icons/plus.vue'
import { typing } from '../../../directives/typing'

/**
 * This component shows a suggested related prompt.
 */
export default defineComponent({
  name: 'RelatedPrompt',
  directives: {
    typing,
  },
  components: {
    CrossTinyIcon,
    PlusIcon,
  },
  props: {
    relatedPrompt: {
      type: Object as PropType<RelatedPrompt>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="css">
.x-related-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: start;
  padding: 8px;
  gap: 8px;
  height: 100%;
  width: 100%;
}

.x-related-prompt-text {
  text-align: left;
  flex-grow: 1;
}

.x-related-prompt-icon {
  flex-shrink: 0;
  align-self: start;
}
</style>
