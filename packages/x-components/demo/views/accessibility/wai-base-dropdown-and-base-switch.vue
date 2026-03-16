<template>
  <section class="x-flex x-flex-col x-gap-16 x-p-32">
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

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import BaseColumnPickerDropdown from '../../../src/components/column-picker/base-column-picker-dropdown.vue'
import { useXBus } from '../../../src/composables/use-x-bus'
import HistoryQueriesSwitch from '../../../src/x-modules/history-queries/components/history-queries-switch.vue'
import SortDropdown from '../../../src/x-modules/search/components/sort-dropdown.vue'

export default defineComponent({
  name: 'AccessibilityCheck',
  components: {
    BaseColumnPickerDropdown,
    HistoryQueriesSwitch,
    SortDropdown,
  },
  setup() {
    const bus = useXBus()
    onMounted(() => {
      bus.emit('UserClickedASort', 'default')
      bus.emit('UserClickedEnableHistoryQueries')
    })
    return {
      sortValues: ['default', 'price asc', 'price desc'],
    }
  },
})
</script>
