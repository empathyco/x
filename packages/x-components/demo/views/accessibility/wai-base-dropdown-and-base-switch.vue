<template>
  <section class="xds:flex xds:flex-col xds:gap-16 xds:p-32">
    <div>
      <h1>BaseColumnPickerDropdown</h1>
      <BaseColumnPickerDropdown :columns="[2, 4, 6]">
        <template #item="{ item, isSelected, isHighlighted }">
          <span v-if="isHighlighted">🟢</span>
          <span v-if="isSelected">✅</span>
          <span>{{ item }}</span>
        </template>
      </BaseColumnPickerDropdown>
    </div>

    <div>
      <h1>SortDropdown</h1>
      <SortDropdown :items="sortValues">
        <template #toggle="{ item, isOpen }">{{ item }} {{ isOpen ? '🔼' : '🔽' }}</template>
        <template #item="{ item, isHighlighted, isSelected }">
          <span v-if="isSelected">✅</span>
          <span v-if="isHighlighted">🟢</span>
          {{ item }}
        </template>
      </SortDropdown>
    </div>

    <div>
      <h1>HistoryQueriesSwitch</h1>
      <HistoryQueriesSwitch />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { BaseColumnPickerDropdown } from '@x/components'
import { useXBus } from '@x/composables'
import { HistoryQueriesSwitch } from '@x/x-modules/history-queries'
import { SortDropdown } from '@x/x-modules/search'
import { onMounted } from 'vue'

const sortValues = ['default', 'price asc', 'price desc']

const bus = useXBus()
onMounted(() => {
  bus.emit('UserClickedASort', 'default')
  bus.emit('UserClickedEnableHistoryQueries')
})
</script>
