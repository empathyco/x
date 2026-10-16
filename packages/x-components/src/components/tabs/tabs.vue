<template>
  <nav class="xds:tabs" data-test="tabs" :aria-label="ariaLabels?.root" role="tablist">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="xds:tab"
      :class="[itemClasses, { 'xds:selected': item.selected }]"
      data-test="tab"
      role="tab"
      :aria-selected="item.selected"
      @click="item.click()"
    >
      <slot :item="item">{{ item.label }}</slot>
    </button>
  </nav>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { Tab } from './tab.types'
import { useAccessibilityLabels } from '@x/composables'
import { defineComponent } from 'vue'

/**
 * Renders a list of tabs from the given `items`. It keeps track of the
 * selected tab internally: clicking a tab marks it as selected and invokes
 * its `click` callback.
 *
 * @public
 */
export default defineComponent({
  name: 'Tabs',
  props: {
    /**
     * The tabs to render.
     *
     * @public
     */
    items: {
      type: Array as PropType<Tab[]>,
      required: true,
    },
    /**
     * The classes for tab item.
     *
     * @public
     */
    itemClasses: String,
  },
  setup() {
    const ariaLabels = useAccessibilityLabels('tabs')

    return { ariaLabels }
  },
})
</script>
