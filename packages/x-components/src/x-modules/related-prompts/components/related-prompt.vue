<template>
  <button
    class="x-flex x-items-center x-p-8 x-justify-between x-text-start"
    aria-pressed="true"
    tabindex="0"
  >
    <slot name="extra-content" />
    <span v-typing="{ text: relatedPrompt.suggestionText, speed: 50 }" />
    <component :is="selected ? 'CrossTinyIcon' : 'PlusIcon'" class="x-icon-lg x-self-start" />
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
   *
   * It provides a slot to customize the extra related prompt button information.
   *
   * @public
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
