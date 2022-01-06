<template>
  <div v-if="result.rating">
    <BaseRating :value="result.rating.value" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Result } from '@empathyco/x-types';
  import BaseRating from '../base-rating.vue';

  @Component({
    components: {
      BaseRating
    }
  })
  export default class BaseResultRating extends Vue {
    @Prop()
    protected result!: Result;
  }
</script>

<style scoped lang="scss"></style>
