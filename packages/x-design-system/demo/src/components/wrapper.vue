<template>
  <table class="xds:min-w-full xds:border xds:border-neutral-50">
    <thead class="xds:bg-neutral-25">
      <tr>
        <th colspan="2" class="xds:p-12 xds:text-xl">{{ feature }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row" class="xds:not-last:border-b xds:border-b-neutral-10">
        <td class="xds:w-192 xds:p-12 xds:text-right">{{ row }}</td>
        <td class="xds:p-12 xds:flex xds:items-center xds:flex-wrap xds:gap-8">
          <slot :name="row" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  feature: String,
  rows: {
    type: Array as PropType<string[]>,
  },
})
</script>
