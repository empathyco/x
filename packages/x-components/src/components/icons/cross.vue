<template functional>
  <svg
    :class="['x-icon'].concat(data.staticClass, data.class)"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g fill="none" fill-rule="evenodd">
      <line x1="14" y1="2" x2="2" y2="14" />
      <line x1="2" y1="2" x2="14" y2="14" />
    </g>
  </svg>
</template>

<script lang="ts">
  export default {};
</script>
