<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input"
    :sections="sections"
  >
    <input
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      :placeholder="removeClassPrefix(cssClass, base).trim() || 'input'"
      @click="copyCssClassesToClipboard"
    />
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
import type { ShowcaseSections } from '../types/types';
  import { defineComponent } from 'vue';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase
    },
    props: {
      base: {
        type: String,
        default: 'x-input'
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-input-sm', 'x-input-md', 'x-input-lg']
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-input-neutral',
          'x-input-lead',
          'x-input-auxiliary',
          'x-input-accent',
          'x-input-highlight',
          'x-input-success',
          'x-input-warning',
          'x-input-error'
        ]
      },
      line: {
        type: String,
        default: 'x-input-line'
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-input-lead x-input-sm',
          'x-input-auxiliary x-input-line x-input-sm',
          'x-input-accent x-input-lg',
          'x-input-warning x-input-line x-input-lg'
        ]
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base],
          Sizes: this.sizes.map(addParentClasses(this.base)),
          Colors: this.colors.map(addParentClasses(this.base)),
          Line: [addParentClasses(this.base)(this.line)],
          'Line Sizes': this.sizes.map(addParentClasses(this.base, this.line)),
          'Line Colors': this.colors.map(addParentClasses(this.base, this.line)),
          Disabled: [this.base, addParentClasses(this.base)(this.line)],
          Combinations: this.combinations.map(addParentClasses(this.base))
        };
      }
    },
    methods: {
      copyCssClassesToClipboard(event: MouseEvent): void {
        navigator.clipboard.writeText((event.currentTarget as HTMLElement).classList.value);
      },
      removeClassPrefix(cssClasses: string, prefix: string): string {
        return cssClasses.replace(new RegExp(`${prefix}-?`, 'g'), '');
      }
    }
  });
</script>
