<template>
  <Result :result="resultData"></Result>
</template>

<script lang="ts" setup>
import { createResultStub } from '@x/__stubs__'
import Result from '../home/result.vue'

const resultData = createResultStub('Demo result', {
  images: [
    'https://empathyco-test-images-fashion-farfetch.s3.eu-west-1.amazonaws.com/tmptest/13/76/29/60/13762960_17724928_480.jpg',
  ],
  url: 'https://www.lolahome.es/escobilla-zen-ceramica-blanco-gris-29075',
})
</script>
