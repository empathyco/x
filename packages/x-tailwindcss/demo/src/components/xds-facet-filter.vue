<template>
  <XdsBaseShowcase
    v-slot="{ cssClass, copyCssClassesToClipboard, section }"
    title="Facet Filter"
    :sections="sections"
  >
    <button
      :class="cssClass"
      :style="section === 'Default' ? { width: '200px' } : ''"
      :disabled="section === 'Disabled'"
      @click="copyCssClassesToClipboard"
    >
      <CheckIcon
        v-if="cssClass.includes('x-selected')"
        class="x-icon"
        :class="{ 'x-icon-lg': cssClass.includes('x-facet-filter-lg') }"
      />
      <UncheckIcon
        v-else
        class="x-icon"
        :class="{ 'x-icon-lg': cssClass.includes('x-facet-filter-lg') }"
      />

      <span v-if="section === 'Default'">very long default filter to test line wrap alignment</span>
      <span v-else>filter</span>

      <span
        v-if="section === 'Combinations'"
        class="x-badge x-badge-circle x-badge-light x-badge-lead"
      >
        1
      </span>
      <span v-else>(123)</span>
    </button>
  </XdsBaseShowcase>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { ShowcaseSections } from '../types/types'
import { defineComponent } from 'vue'
import { addParentClasses } from '../utils'
import CheckIcon from './icons/check.vue'
import UncheckIcon from './icons/uncheck.vue'
import XdsBaseShowcase from './xds-base-showcase.vue'

export default defineComponent({
  components: { CheckIcon, XdsBaseShowcase, UncheckIcon },
  props: {
    base: {
      type: String,
      default: 'x-facet-filter',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['x-facet-filter-sm', 'x-facet-filter-md', 'x-facet-filter-lg'],
    },
    selected: {
      type: String,
      default: 'x-selected',
    },
    underline: {
      type: String,
      default: 'x-facet-filter-underline',
    },
    ghost: {
      type: String,
      default: 'x-facet-filter-ghost',
    },
    simple: {
      type: String,
      default: 'x-facet-filter-simple',
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'x-facet-filter-neutral',
        'x-facet-filter-lead',
        'x-facet-filter-auxiliary',
        'x-facet-filter-accent',
        'x-facet-filter-highlight',
        'x-facet-filter-success',
        'x-facet-filter-warning',
        'x-facet-filter-error',
      ],
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'x-facet-filter-ghost x-facet-filter-lg x-facet-filter-warning x-selected',
        'x-facet-filter-ghost x-facet-filter-success x-facet-filter-underline x-selected',

        'x-facet-filter-simple x-facet-filter-lg x-facet-filter-success x-facet-filter-underline x-selected',
      ],
    },
  },
  computed: {
    sections(): ShowcaseSections {
      return {
        Default: [this.base],
        Colors: this.colors.map(addParentClasses(this.base)),
        Sizes: this.sizes.map(addParentClasses(this.base)),
        Selected: this.colors.map(addParentClasses(this.base, this.selected)),
        Underline: this.colors.map(addParentClasses(this.base, this.underline)),
        'Selected Underline': this.colors.map(
          addParentClasses(this.base, this.underline, this.selected),
        ),
        Ghost: this.colors.map(addParentClasses(this.base, this.ghost)),
        'Selected Ghost': this.colors.map(addParentClasses(this.base, this.ghost, this.selected)),
        Simple: this.colors.map(addParentClasses(this.base, this.simple)),
        'Selected Simple': this.colors.map(addParentClasses(this.base, this.simple, this.selected)),
        Disabled: [
          this.base,
          addParentClasses(this.base)(this.selected),
          addParentClasses(this.base)(this.ghost),
          addParentClasses(this.base, this.selected)(this.ghost),
          addParentClasses(this.base)(this.simple),
          addParentClasses(this.base, this.selected)(this.simple),
          addParentClasses(this.base)(this.underline),
          addParentClasses(this.base, this.selected)(this.underline),
        ],
        Combinations: this.combinations.map(addParentClasses(this.base)),
      }
    },
  },
})
</script>
