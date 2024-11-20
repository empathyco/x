<template>
  <XdsBaseShowcase
    title="Progress Bar"
    :sections="sections"
    #default="{ cssClass, copyCssClassesToClipboard, removeClassPrefix }"
  >
    <div class="lex-col flex gap-4">
      <h3 class="text-sm">{{ removeClassPrefix(cssClass, base).trim() || 'default' }}</h3>
      <div
        @click="copyCssClassesToClipboard"
        @keyup="copyCssClassesToClipboard"
        class="w-[320px]"
        :class="cssClass"
      >
        <div class="x-progress-bar-fill x-w-[30%]" />
      </div>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: { XdsBaseShowcase },
    props: {
      base: {
        type: String,
        default: 'x-progress-bar'
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          '',
          'x-progress-bar-neutral',
          'x-progress-bar-lead',
          'x-progress-bar-auxiliary',
          'x-progress-bar-accent',
          'x-progress-bar-highlight',
          'x-progress-bar-success',
          'x-progress-bar-warning',
          'x-progress-bar-error'
        ]
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-progress-bar-md', 'x-progress-bar-lg']
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => ['x-progress-bar-lg x-progress-bar-warning']
      }
    },
    setup(props) {
      const sections = computed<ShowcaseSections>(() => ({
        Default: [props.base],
        Sizes: props.sizes.map(addParentClasses(props.base)),
        Colors: props.colors.map(addParentClasses(props.base)),
        Combinations: props.combinations.map(addParentClasses(props.base))
      }));

      const copyCssClassesToClipboard = (event: MouseEvent | KeyboardEvent): void => {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      };

      const removeClassPrefix = (cssClasses: string, prefix: string): string => {
        return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
      };

      return { sections, copyCssClassesToClipboard, removeClassPrefix };
    }
  });
</script>
