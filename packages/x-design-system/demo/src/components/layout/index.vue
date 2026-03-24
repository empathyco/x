<template>
  <Wrapper feature="Layout" :rows="rows">
    <template v-for="row in rows" #[row] :key="row">
      <button class="xds:button" @click="selectedRow = row">See {{ row }}</button>
      <component
        :is="components[row]"
        v-if="selectedRow === row"
        class="modal"
        @close="selectedRow = undefined"
      />
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Wrapper from '../wrapper.vue'
import FixedHeader from './fixed-header.vue'
import Layouts from './layouts.vue'
import SingleColumn from './single-column.vue'
import TwoColumns from './two-columns.vue'
import Utilities from './utilities.vue'

type Layout = 'layouts' | 'utilities' | 'fixed-header' | 'single-column' | 'two-columns'

const rows: Layout[] = ['layouts', 'utilities', 'fixed-header', 'single-column', 'two-columns']
const selectedRow = ref<Layout | undefined>(undefined)

const components: Record<Layout, any> = {
  layouts: Layouts,
  utilities: Utilities,
  'fixed-header': FixedHeader,
  'single-column': SingleColumn,
  'two-columns': TwoColumns,
}
</script>

<style lang="css">
.modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
}

html:has(.modal) {
  overflow: hidden;
}
</style>
