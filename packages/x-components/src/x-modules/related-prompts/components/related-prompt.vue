<template>
  <button class="x-related-prompt">
    <!--
     @slot related-prompt-extra-content - The slot to render related prompt extra information.
     @prop {Object} relatedPrompt - The related prompt object.
    -->
    <slot name="related-prompt-extra-content" :related-prompt="relatedPrompt" />
    <span
      v-typing="{ text: relatedPrompt.suggestionText, speed: 50 }"
      class="x-related-prompt-text"
      :class="{ 'x-related-prompt-text--selected': selected }"
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
    /**
     * The related prompt to render.
     *
     * @public
     */
    relatedPrompt: {
      type: Object as PropType<RelatedPrompt>,
      required: true,
    },
    /**
     * Indicates if the related prompt is selected.
     *
     * @public
     */
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

.x-related-prompt-text.x-related-prompt-text--selected {
  text-align: center;
}

.x-related-prompt-icon {
  height: 24px;
  flex-shrink: 0;
  align-self: start;
}
</style>
