<template>
  <div class="xds:suggestion-group">
    <button class="xds:suggestion">
      <Curated class="xds:icon" />
      <slot>suggestion group</slot>
    </button>
    <button class="xds:suggestion-group-button" :class="buttonClass">
      <slot name="button">
        <Cross class="xds:icon" />
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
import Cross from '../icons/cross.svg'
import Curated from '../icons/curated.svg'

defineProps({
  buttonClass: String,
})
</script>
