<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Input Group"
    :sections="sections"
  >
    <div
      :key="cssClass"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
      @click="copyCssClassesToClipboard"
      @keydown="copyCssClassesToClipboard"
    >
      <CuratedIcon class="x-icon" />
      <input
        class="x-input"
        :disabled="section === 'Disabled'"
        :placeholder="
          removeClassPrefix(cssClass, base).trim() ||
          (section.includes('Line') && 'line') ||
          'input-group'
        "
      />
      <button
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button"
        @click.stop="copyCssClassesToClipboard"
      >
        <CrossIcon class="x-icon" />
      </button>
      <button
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button x-input-group-button-rectangle"
        @click.stop="copyCssClassesToClipboard"
      >
        clear
      </button>
      <button
        :disabled="section === 'Disabled'"
        class="x-button x-input-group-button-primary"
        :class="{
          'x-input-group-button-outlined': section.includes('Outlined'),
          'x-input-group-button-ghost': section.includes('Ghost')
        }"
        @click.stop="copyCssClassesToClipboard"
      >
        <CheckIcon class="x-icon" />
      </button>
    </div>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
import type { ShowcaseSections } from '../types/types';
  import { defineComponent } from 'vue';
  import { addParentClasses } from '../utils';
  import CheckIcon from './icons/check.vue';
  import CrossIcon from './icons/cross.vue';
  import CuratedIcon from './icons/curated.vue';
  import XdsBaseShowcase from './xds-base-showcase.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase,
      CheckIcon,
      CrossIcon,
      CuratedIcon
    },
    props: {
      base: {
        type: String,
        default: 'x-input-group'
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-input-group-sm', 'x-input-group-md', 'x-input-group-lg']
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-input-group-neutral',
          'x-input-group-lead',
          'x-input-group-auxiliary',
          'x-input-group-accent',
          'x-input-group-highlight',
          'x-input-group-success',
          'x-input-group-warning',
          'x-input-group-error'
        ]
      },
      line: {
        type: String,
        default: 'x-input-group-line'
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-input-group-lead x-input-group-sm',
          'x-input-group-auxiliary x-input-group-line x-input-group-sm',
          'x-input-group-accent x-input-group-lg ',
          'x-input-group-warning x-input-group-line x-input-group-lg'
        ]
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base],
          Sizes: this.sizes.map(addParentClasses(this.base)),
          Colors: this.colors.map(addParentClasses(this.base)),
          Outlined: ['', ...this.colors].map(addParentClasses(this.base)),
          Ghost: ['', ...this.colors].map(addParentClasses(this.base)),
          Line: [addParentClasses(this.base)(this.line)],
          'Line Sizes': this.sizes.map(addParentClasses(this.base, this.line)),
          'Line Colors': this.colors.map(addParentClasses(this.base, this.line)),
          'Line Button Outlined': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
          'Line Button Ghost': ['', ...this.colors].map(addParentClasses(this.base, this.line)),
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
