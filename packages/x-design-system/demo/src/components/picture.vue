<template>
  <Wrapper feature="Picture" :rows="rows">
    <template #default>
      <div class="xds:picture xds:picture-zoom xds:w-50">
        <img
          src="https://assets.empathy.co/images-demo/2885.jpg"
          alt="Summer Sandal"
          class="xds:picture-image"
        />
      </div>
    </template>
    <template #overlay>
      <div class="xds:picture xds:picture-overlay xds:w-50">
        <img
          src="https://assets.empathy.co/images-demo/2885.jpg"
          alt="Summer Sandal"
          class="xds:picture-image"
        />
      </div>
    </template>
  </Wrapper>
</template>
<script setup lang="ts">
import Wrapper from './wrapper.vue'

const rows = ['default', 'overlay']
</script>
