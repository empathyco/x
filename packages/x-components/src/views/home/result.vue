<template>
  <article class="x-result" style="max-width: 300px">
    <BaseResultImage :result="result" class="x-picture--colored">
      <template #placeholder>
        <div style="padding-top: 100%; background-color: lightgray"></div>
      </template>
      <template #fallback>
        <div
          data-test="result-picture-fallback"
          style="padding-top: 100%; background-color: lightsalmon"
        ></div>
      </template>
    </BaseResultImage>
    <h1 class="x-title3" data-test="result-title">{{ result.name }}</h1>
  </article>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import BaseResultImage from '../../components/result/base-result-image.vue';

  @Component({
    components: {
      BaseResultImage
    }
  })
  export default class ResultComponent extends Vue {
    @Prop()
    protected result!: Result;
  }
</script>

<style scoped lang="scss"></style>
