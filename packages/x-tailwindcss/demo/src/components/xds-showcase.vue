<template>
  <div class="x-flex x-flex-col x-gap-40 x-p-20">
    <XdsButton />
    <XdsIcon />
    <XdsSuggestion />
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import XdsButton from './xds-button.vue';
  import XdsIcon from './xds-icon.vue';
  import XdsSuggestion from './xds-suggestion.vue';

  @Component({
    components: { XdsButton, XdsIcon, XdsSuggestion }
  })
  export default class XdsShowcase extends Vue {}
</script>
