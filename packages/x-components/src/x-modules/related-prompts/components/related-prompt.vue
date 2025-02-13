<template>
  <button class="x-related-prompt">
    <span v-typing="{ text: relatedPrompt.suggestionText, speed: 50 }" />
    <component
      :is="selected ? 'CrossTinyIcon' : 'PlusIcon'"
      class="x-icon-lg x-related-prompt-icon"
    />
  </button>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { RelatedPrompt } from '@empathyco/x-types';
  import CrossTinyIcon from '../../../components/icons/cross-tiny.vue';
  import PlusIcon from '../../../components/icons/plus.vue';
  import vTyping from '../../../directives/typing';

  /**
   * This component shows a suggested related prompt.
   */
  export default defineComponent({
    name: 'RelatedPrompt',
    directives: {
      typing: vTyping
    },
    components: {
      CrossTinyIcon,
      PlusIcon
    },
    props: {
      relatedPrompt: {
        type: Object as PropType<RelatedPrompt>,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    }
  });
</script>
<style lang="css">
  .x-related-prompt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: start;
    padding: 8px;
    height: 100%;
    width: 100%;
  }
  .x-related-prompt-icon {
    align-self: start;
  }
</style>
