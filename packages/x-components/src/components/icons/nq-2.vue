<template functional>
  <svg
    :class="['x-icon'].concat(data.staticClass, data.class)"
    viewBox="0 0 16 16"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <g fill="none" fill-rule="evenodd">
      <line x1="3" y1="3" x2="13" y2="13" />
      <polyline points="13 3 13 13 3 13" />
    </g>
  </svg>
</template>

<script lang="ts">
  export default {};
</script>
