<template>
  <XdsBaseShowcase
    #default="{ cssClass, section, copyCssClassesToClipboard, removeClassPrefix }"
    title="Button"
    :sections="sections"
  >
    <button
      :key="cssClass"
      @click="copyCssClassesToClipboard"
      :class="cssClass"
      title="Click me to copy CSS classes"
      :disabled="section === 'Disabled'"
    >
      <CuratedIcon class="x-icon" />
      <span v-if="!cssClass.includes('circle') && !cssClass.includes('square')">
        {{ removeClassPrefix(cssClass, base) }} button
      </span>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { ShowcaseSections } from '../types/types';
  import { addParentClasses } from '../utils';
  import XdsBaseShowcase from './xds-base-showcase.vue';
  import CuratedIcon from './icons/curated.vue';

  export default defineComponent({
    components: {
      XdsBaseShowcase,
      CuratedIcon
    },
    props: {
      base: {
        type: String,
        default: 'x-button'
      },
      sizes: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-sm', 'x-button-md', 'x-button-lg', 'x-button-xl']
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [
          '',
          'x-button-neutral',
          'x-button-lead',
          'x-button-auxiliary',
          'x-button-accent',
          'x-button-highlight',
          'x-button-success',
          'x-button-warning',
          'x-button-error'
        ]
      },
      layouts: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-circle', 'x-button-square']
      },
      outline: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-outlined']
      },
      ghost: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-ghost']
      },
      tight: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-tight']
      },
      link: {
        type: Array as PropType<string[]>,
        default: () => ['x-button-link']
      },
      selected: {
        type: Array as PropType<string[]>,
        default: () => ['x-selected']
      },
      combinations: {
        type: Array as PropType<string[]>,
        default: () => [
          'x-button-lead x-button-sm',
          'x-button-outlined x-button-square x-button-lg x-selected',
          'x-button-auxiliary x-button-circle x-button-outlined',
          'x-button-accent x-button-tight',
          'x-button-warning x-button-ghost'
        ]
      }
    },
    computed: {
      sections(): ShowcaseSections {
        return {
          Default: [this.base],
          Sizes: this.sizes.map(addParentClasses(this.base)),
          Layout: this.layouts.map(addParentClasses(this.base)),
          Colors: this.colors.map(addParentClasses(this.base)),
          ['Default Selected']: this.colors.map(addParentClasses(this.base, this.selected)),
          Outline: this.colors.map(addParentClasses(this.base, this.outline)),
          ['Outline Selected']: this.colors.map(
            addParentClasses(this.base, this.selected, this.outline)
          ),
          Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
          ['Ghost Selected']: this.colors.map(
            addParentClasses(this.base, this.selected, this.ghost)
          ),
          Tight: this.colors.map(addParentClasses(this.base, this.tight)),
          ['Tight Selected']: this.colors.map(
            addParentClasses(this.base, this.selected, this.tight)
          ),
          Link: this.colors.map(addParentClasses(this.base, this.link)),
          ['Link Selected']: this.colors.map(addParentClasses(this.base, this.selected, this.link)),
          Disabled: [
            this.base,
            addParentClasses(this.base)(this.selected),
            addParentClasses(this.base)(this.outline),
            addParentClasses(this.base, this.selected)(this.outline),
            addParentClasses(this.base)(this.ghost),
            addParentClasses(this.base, this.selected)(this.ghost),
            addParentClasses(this.base)(this.tight),
            addParentClasses(this.base, this.selected)(this.tight),
            addParentClasses(this.base)(this.link),
            addParentClasses(this.base, this.selected)(this.link)
          ],
          Combinations: this.combinations.map(addParentClasses(this.base))
        };
      }
    }
  });
</script>
