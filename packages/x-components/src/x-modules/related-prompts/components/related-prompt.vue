<template>
  <button class="x-related-prompt">
    <!--
     @slot related-prompt-extra-content - The slot to render related prompt extra information.
     @prop {Object} relatedPrompt - The related prompt object.
    -->
    <slot name="related-prompt-extra-content" :related-prompt="relatedPrompt">
      <img
        v-if="relatedPrompt.suggestionImageUrl"
        :width="56"
        :height="56"
        :src="relatedPrompt.suggestionImageUrl"
        :alt="relatedPrompt.nextQueries[0]"
        class="x-related-prompts-item-image"
      />
    </slot>
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

.x-related-prompts-item-image {
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background-color: white;
  object-fit: cover;
}
</style>

<docs lang="mdx">
## See it in action

### Basic usage

```vue live
<template>
  <RelatedPrompt :relatedPrompt="relatedPrompt" />
</template>

<script setup>
import { RelatedPrompt } from '@empathyco/x-components/related-prompts'
import { ref } from 'vue'

const relatedPrompt = ref({
  suggestionText: 'Try shoes',
  suggestionImageUrl: 'https://via.placeholder.com/56',
  nextQueries: ['shoes'],
})
</script>
```

### Customizing the extra content slot

```vue live
<template>
  <RelatedPrompt :relatedPrompt="relatedPrompt">
    <template #related-prompt-extra-content="{ relatedPrompt }">
      <span>Extra: {{ relatedPrompt.suggestionText }}</span>
    </template>
  </RelatedPrompt>
</template>

<script setup>
import { RelatedPrompt } from '@empathyco/x-components/related-prompts'
import { ref } from 'vue'

const relatedPrompt = ref({
  suggestionText: 'Try bags',
  suggestionImageUrl: '',
  nextQueries: ['bags'],
})
</script>
```
</docs>
