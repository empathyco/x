<template>
  <Wrapper feature="Typography" :rows="rows">
    <template v-for="row in rows" :key="row" #[row]>
      <p
        class="xds:whitespace-normal"
        :class="[row.includes('-') ? `xds:${row.split('-')[0]}` : '', `xds:${row}`]"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce gravida posuere nisi, sed
        porttitor sem semper ac. Aliquam erat volutpat
      </p>
    </template>
  </Wrapper>
</template>

<script setup lang="ts">
import Wrapper from './wrapper.vue'

/*
  Tailwind safelist classes:
  xds:text1 xds:text1-sm xds:text1-md xds:text1-lg
  xds:title1 xds:title1-sm xds:title1-md xds:title1-lg
  xds:title2 xds:title2-sm xds:title2-md xds:title2-lg
  xds:title3 xds:title3-sm xds:title3-md xds:title3-lg
  xds:title4 xds:title4-sm xds:title4-md xds:title4-lg
*/

const utilities = ['text1', 'title1', 'title2', 'title3', 'title4']
const sizes = ['sm', 'md', 'lg']
const rows = utilities.map(utility => [utility, ...sizes.map(size => `${utility}-${size}`)]).flat()
</script>
