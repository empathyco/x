<template>
  <section class="x-flex x-padding--07 x-gap-16">
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
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  // eslint-disable-next-line max-len
  import BaseColumnPickerDropdown from '../../components/column-picker/base-column-picker-dropdown.vue';
  import SortDropdown from '../../x-modules/search/components/sort-dropdown.vue';
  // eslint-disable-next-line max-len
  import HistoryQueriesSwitch from '../../x-modules/history-queries/components/history-queries-switch.vue';

  @Component({
    components: {
      BaseColumnPickerDropdown,
      HistoryQueriesSwitch,
      SortDropdown
    }
  })
  export default class AccessibilityCheck extends Vue {
    mounted(): void {
      this.$x.emit('UserClickedASort', 'default');
      this.$x.emit('UserClickedEnableHistoryQueries');
    }
    protected sortValues = ['default', 'price asc', 'price desc'];
  }
</script>
