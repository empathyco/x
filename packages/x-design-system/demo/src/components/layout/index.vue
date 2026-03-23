<template>
  <Wrapper feature="Layout" :rows="rows">
    <template #layouts>
      <button class="xds:button" @click="selectedRow = 'layouts'">See layouts</button>
      <Layouts
        v-if="selectedRow === 'layouts'"
        class="modal layout-modal"
        @close="selectedRow = undefined"
      />
    </template>
    <template #utilities>
      <button class="xds:button" @click="selectedRow = 'utilities'">See utilities</button>
      <Utilities
        v-if="selectedRow === 'utilities'"
        class="modal layout-modal"
        @close="selectedRow = undefined"
      />
    </template>
    <template #fixed-header>
      <button class="xds:button" @click="selectedRow = 'fixed-header'">See fixed-header</button>
      <FixedHeader
        v-if="selectedRow === 'fixed-header'"
        class="modal layout-modal"
        @close="selectedRow = undefined"
      />
    </template>
    <template #single-column>
      <button class="xds:button" @click="selectedRow = 'single-column'">See single-column</button>
      <SingleColumn
        v-if="selectedRow === 'single-column'"
        class="modal layout-modal"
        @close="selectedRow = undefined"
      />
    </template>
    <template #two-columns>
      <button class="xds:button" @click="selectedRow = 'two-columns'">See tow-columns</button>
      <TwoColumns
        v-if="selectedRow === 'two-columns'"
        class="modal layout-modal"
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

const rows = ['layouts', 'utilities', 'fixed-header', 'single-column', 'two-columns']
const selectedRow = ref<(typeof rows)[number] | undefined>(undefined)
</script>

<style lang="css">
.modal {
  pointer-events: none;
  visibility: hidden;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  overflow-y: auto;
}

.layout-modal {
  pointer-events: auto;
  visibility: visible;
  opacity: 1;
}

html:has(.layout-modal) {
  overflow: hidden;
}
</style>
