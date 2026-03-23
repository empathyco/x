<template>
  <div class="xds:bg-white xds:layout">
    <div class="xds:flex xds:p-12">
      <div class="xds:title2">Layouts</div>
      <button class="xds:ml-auto xds:button xds:button-link" @click="$emit('close')">Close</button>
    </div>

    <div
      v-for="(items, name) in layouts"
      :key="name"
      class="xds:flex xds:flex-col xds:gap-12 xds:pb-64"
    >
      <h1 class="xds:px-12 xds:title3">{{ name }}</h1>
      <div v-for="item in items" :key="item" class="xds:layout-container xds:pb-20" :class="item">
        <code class="xds:px-12">xds:layout-container {{ item }}</code>
        <div class="xds:layout-item xds:bg-gray-300">
          <span class="xds:bg-gray-400 xds:p-12">item</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])

const layouts = {
  Layout: [''],
  MaxWidth: ['xds:layout-max-width-md', 'xds:layout-max-width-lg', 'xds:layout-max-width-full'],
  MinMargin: [
    'xds:layout-min-margin-12',
    'xds:layout-min-margin-20',
    'xds:layout-min-margin-32',
    'xds:layout-min-margin-80',
  ],
  CustomAlign: [
    'xds:layout-container-mx-128',
    'xds:layout-container-mr-128',
    'xds:layout-container-ml-128',
    'xds:layout-container-ml-[375px]',
  ],
}
</script>
