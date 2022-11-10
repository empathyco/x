<template>
  <div class="x-flex x-flex-col x-gap-40">
    <XdsButton />
    <XdsIcon />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsButton from './xds-button.vue';
  import XdsIcon from './xds-icon.vue';

  @Component({
    components: { XdsButton, XdsIcon }
  })
  export default class XdsShowcase extends Vue {}
</script>
