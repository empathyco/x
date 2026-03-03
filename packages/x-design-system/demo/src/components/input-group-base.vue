<template>
  <div class="xds:input-group" :class="wrapperClass" :disabled>
    <Curated class="xds:icon" />
    <input class="xds:input" :placeholder :disabled />
    <button class="xds:button xds:input-group-button" :disabled>
      <Cross class="xds:icon" />
    </button>
    <button class="xds:button xds:input-group-button xds:input-group-button-rectangle" :disabled>
      clear
    </button>
    <button class="xds:button xds:input-group-button-primary" :disabled>
      <Check class="xds:icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Check from './icons/check.svg'
import Cross from './icons/cross.svg'
import Curated from './icons/curated.svg'

defineProps({
  wrapperClass: String,
  buttonClass: String,
  placeholder: String,
  disabled: Boolean,
})
</script>
