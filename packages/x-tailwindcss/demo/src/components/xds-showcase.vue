<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsSuggestion />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsButton from './xds-button.vue';
  import XdsSuggestion from './xds-suggestion.vue';

  @Component({
    components: { XdsButton, XdsSuggestion }
  })
  export default class XdsShowcase extends Vue {}
</script>
