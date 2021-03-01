<template>
  <main>
    <BaseEventsOpenButton>Open search (events modal)</BaseEventsOpenButton>
    <BaseEventsModal :animation="collapseFromTop">
      <SearchInput placeholder="Search" aria-label="Search for products" />
      <BaseEventsCloseButton aria-label="Close search">x</BaseEventsCloseButton>
    </BaseEventsModal>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseEventsModal from '../components/modals/base-events-modal.vue';
  import BaseEventsCloseButton from '../components/modals/base-events-modal-close.vue';
  import BaseEventsOpenButton from '../components/modals/base-events-modal-open.vue';
  import CollapseFromTop from '../components/animations/collapse-from-top.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { XInstaller } from '../x-installer/x-installer';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    },
    components: {
      BaseEventsModal,
      BaseEventsCloseButton,
      BaseEventsOpenButton,
      SearchInput
    }
  })
  export default class App extends Vue {
    protected collapseFromTop = CollapseFromTop;
  }
</script>

<style lang="scss">
  .x-modal-content {
    background-color: white;
    height: 200px;
    width: 100%;
  }
</style>
