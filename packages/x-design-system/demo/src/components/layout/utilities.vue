<template>
  <div class="xds:bg-white xds:layout">
    <div class="xds:flex xds:p-12">
      <div class="xds:title2">Layout Utilities</div>
      <button class="xds:ml-auto xds:button xds:button-link" @click="$emit('close')">Close</button>
    </div>

    <!-- No Margin -->
    <div class="xds:flex xds:flex-col xds:gap-12 xds:pb-64">
      <h1 class="xds:px-12 xds:title3">NO Margin</h1>
      <p class="xds:px-12 xds:text-lg">
        Removes the margin from one or both sides of the layout item.
      </p>
      <div
        v-for="cssClass in [
          'xds:layout-no-margin',
          'xds:layout-no-margin-left',
          'xds:layout-no-margin-right',
        ]"
        :key="cssClass"
        class="xds:h-128 xds:w-full xds:pb-20"
      >
        <code class="xds:px-12">xds:layout-item {{ cssClass }}</code>
        <div class="xds:layout-container xds:bg-gray-200 xds:layout-min-margin-256">
          <div class="xds:layout-item" :class="cssClass">
            <span class="xds:bg-gray-300 xds:p-12">item</span>
          </div>
        </div>
      </div>
    </div>

    <!-- On Margin -->
    <div class="xds:flex xds:flex-col xds:gap-12 xds:pb-64">
      <h1 class="xds:px-12 xds:title3">ON Margin</h1>
      <p class="xds:px-12 xds:text-lg">
        Positions an element in one of the side margins of the layout.
      </p>
      <div
        v-for="cssClass in ['xds:layout-on-margin-left', 'xds:layout-on-margin-right']"
        :key="cssClass"
        class="xds:h-128 xds:w-full xds:pb-20"
      >
        <code class="xds:px-12">xds:layout-item {{ cssClass }}</code>
        <div class="xds:layout-container xds:bg-gray-200 xds:layout-min-margin-256">
          <div class="xds:layout-item">
            <div v-if="cssClass === 'xds:layout-on-margin-right'" class="xds:bg-gray-300 xds:p-12">
              item
            </div>
            <div class="xds:bg-gray-400 xds:p-12" :class="cssClass">
              {{ cssClass }}
            </div>
            <div v-if="cssClass === 'xds:layout-on-margin-left'" class="xds:bg-gray-300 xds:p-12">
              item
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlap -->
    <div class="xds:flex xds:flex-col xds:gap-12 xds:pb-64">
      <h1 class="xds:px-12 xds:title3">Overlap</h1>
      <p class="xds:px-12 xds:text-lg">Positions an element over a layout item.</p>
      <div
        v-for="cssClass in ['xds:layout-overlap', 'xds:layout-overlap-from-top']"
        :key="cssClass"
        class="xds:h-128 xds:w-full xds:pb-20"
      >
        <code class="xds:px-12">xds:layout-item {{ cssClass }}</code>
        <div class="xds:layout-container xds:bg-gray-200 xds:layout-min-margin-256">
          <div v-if="cssClass === 'xds:layout-overlap'" class="xds:layout-item">
            <span class="xds:h-23 xds:bg-gray-300 xds:p-12">item</span>
          </div>
          <div class="xds:layout-item" :class="cssClass">
            <span class="xds:w-[80%] xds:justify-self-center xds:bg-gray-400 xds:p-12">
              This is overlapping
            </span>
          </div>
          <div v-if="cssClass === 'xds:layout-overlap-from-top'" class="xds:layout-item">
            <span class="xds:h-23 xds:bg-gray-300 xds:p-12">item</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Expand -->
    <div class="xds:flex xds:flex-col xds:gap-12 xds:pb-64">
      <h1 class="xds:px-12 xds:title3">Expand</h1>
      <p class="xds:px-12 xds:text-lg">Makes a layout item to fit the container height.</p>
      <div class="xds:h-128 xds:w-full xds:pb-20">
        <code class="xds:px-12">xds:layout-item xds:layout-expand</code>
        <div class="xds:layout-container xds:bg-gray-200 xds:layout-min-margin-256">
          <div class="xds:layout-item xds:layout-expand xds:bg-gray-200">
            <span class="xds:bg-gray-300 xds:p-12">item</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stack -->
    <div class="xds:flex xds:flex-col xds:gap-12 xds:pb-64">
      <h1 class="xds:px-12 xds:title3">Stack</h1>
      <p class="xds:px-12 xds:text-lg">Stack layout.</p>
      <div class="xds:h-128 xds:w-full xds:pb-20">
        <code class="xds:px-12">xds:layout-item xds:layout-stack</code>
        <div class="xds:layout-container xds:bg-gray-200">
          <div class="xds:layout-stack xds:layout-item">
            <span class="xds:bg-gray-300 xds:p-12">item</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
