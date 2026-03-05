<template>
  <div class="xds:sliding-panel" :class="wrapperClass">
    <button class="xds:sliding-panel-button xds:sliding-panel-button-left">ᐸ</button>
    <div class="xds:flex xds:gap-3" :class="contentClass">
      <div
        v-for="(item, index) of items"
        :key="index"
        class="xds:flex xds:min-h-25 xds:min-w-25 xds:items-center xds:justify-center xds:bg-gray-300"
      >
        <span>{{ item }}</span>
      </div>
    </div>
    <button class="xds:sliding-panel-button xds:sliding-panel-button-right">ᐳ</button>
  </div>
</template>
<script setup lang="ts">
defineProps({
  wrapperClass: String,
  contentClass: String,
})

const items = ['Baghdad', 'Nairobi', 'Ankara', 'Thais', 'Edron']
</script>
