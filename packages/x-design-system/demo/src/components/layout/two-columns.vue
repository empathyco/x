<template>
  <div class="xds:bg-gray-100 xds:layout">
    <div class="xds:layout-container xds:layout-max-width-md xds:layout-min-margin-48">
      <div class="xds:layout-item xds:bg-white">
        <div class="xds:flex xds:items-center xds:justify-between xds:py-12">
          <div class="xds:title3">TWO COLUMNS LAYOUT</div>
          <button class="xds:ml-auto xds:button xds:button-ghost" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>

      <div class="xds:layout-item">
        <div class="xds:flex xds:items-center xds:justify-between xds:py-12">
          <div class="xds:title3">HEADER START</div>
          <div class="xds:title2">HEADER MIDDLE</div>
          <div class="xds:title3">HEADER END</div>
        </div>
      </div>

      <div class="xds:layout-item">
        <div class="xds:flex xds:justify-center xds:p-24 xds:title3">SUBHEADER</div>
      </div>

      <div class="xds:layout-item xds:mt-4 xds:mb-4 xds:layout-expand xds:layout-no-margin-right">
        <div class="xds:flex xds:layout-expand xds:gap-6">
          <div class="xds:scroll xds:w-128">
            <div
              class="xds:flex xds:h-500 xds:flex-col xds:justify-between xds:bg-gray-200 xds:p-3"
            >
              <span>ASIDE</span>
              <span class="xds:place-self-end">ASIDE BOTTOM</span>
            </div>
          </div>

          <div class="xds:layout-expand xds:scroll">
            <div class="xds:layout-item xds:layout-no-margin-left">
              <div
                class="xds:flex xds:h-500 xds:flex-col xds:justify-between xds:bg-gray-200 xds:p-3"
              >
                <section>MAIN</section>
                <span class="xds:place-self-end">MAIN BOTTOM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="xds:layout-overlap xds:layout-item">
        <button
          class="xds:layout-on-margin-right xds:mb-4 xds:button xds:button-circle xds:button-sm xds:justify-self-start"
        >
          ▲
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
