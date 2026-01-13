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
        v-if="cssClass.includes('selected')"
        class="icon"
        :class="{ 'icon-lg': cssClass.includes('facet-filter-lg') }"
      />
      <UncheckIcon
        v-else
        class="icon"
        :class="{ 'icon-lg': cssClass.includes('facet-filter-lg') }"
      />

      <span v-if="section === 'Default'">very long default filter to test line wrap alignment</span>
      <span v-else>filter</span>

      <span v-if="section === 'Combinations'" class="badge badge-circle badge-light badge-lead">
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
      default: 'facet-filter',
    },
    sizes: {
      type: Array as PropType<string[]>,
      default: () => ['facet-filter-sm', 'facet-filter-md', 'facet-filter-lg'],
    },
    selected: {
      type: String,
      default: 'selected',
    },
    underline: {
      type: String,
      default: 'facet-filter-underline',
    },
    ghost: {
      type: String,
      default: 'facet-filter-ghost',
    },
    simple: {
      type: String,
      default: 'facet-filter-simple',
    },
    colors: {
      type: Array as PropType<string[]>,
      default: () => [
        '',
        'facet-filter-neutral',
        'facet-filter-lead',
        'facet-filter-auxiliary',
        'facet-filter-accent',
        'facet-filter-highlight',
        'facet-filter-success',
        'facet-filter-warning',
        'facet-filter-error',
      ],
    },
    combinations: {
      type: Array as PropType<string[]>,
      default: () => [
        'facet-filter-ghost facet-filter-lg facet-filter-warning selected',
        'facet-filter-ghost facet-filter-success facet-filter-underline selected',

        'facet-filter-simple facet-filter-lg facet-filter-success facet-filter-underline selected',
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
