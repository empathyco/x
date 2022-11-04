<template>
  <div class="x-flex x-flex-col"><XdsButton /></div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsButton from './xds-button.vue';

  @Component({
    components: { XdsButton }
  })
  export default class XdsShowcase extends Vue {}
</script>
