<template>
  <MultiColumnMaxWidthLayout :dev-mode="true">
    <template #header-start>
      <span>HEADER START</span>
    </template>
    <template #header-middle>
      <span>HEADER MIDDLE</span>
    </template>
    <template #header-end>
      <span>HEADER END</span>
    </template>
    <template #sub-header>
      <span>SUB HEADER</span>
    </template>
    <template #toolbar-aside>
      <span>TOOLBAR ASIDE</span>
    </template>
    <template #toolbar-body>
      <span>TOOLBAR</span>
    </template>
    <template #main-aside>
      <span>MAIN SIDE</span>
    </template>
    <template #main-body>
      <span>MAIN BODY</span>
    </template>
    <template #scroll-to-top>
      <span>SCROLL TO TOP</span>
    </template>
  </MultiColumnMaxWidthLayout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import FiltersIcon from '../components/icons/filters.vue';
  import Cross from '../components/icons/cross.vue';
  import MultiColumnMaxWidthLayout from '../components/layouts/multi-column-max-width-layout.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  import { XInstaller } from '../x-installer';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    components: {
      Cross,
      MultiColumnMaxWidthLayout,
      BaseIdModalOpen,
      FiltersIcon
    },
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    }
  })
  export default class MultiColumnLayoutView extends Vue {}
</script>

<style scopped lang="scss">
  .x-layout > * {
    display: flex;
    align-items: center;
  }

  .x-layout__sub-header-content {
    display: flex;
    justify-content: center;
  }

  :root {
    --x-color-background-layout-columns-header: var(--x-color-base-lead);
    --x-color-background-layout-columns-sub-header: var(--x-color-base-auxiliary);
    --x-color-background-layout-columns-toolbar: var(--x-color-base-neutral-35);
    --x-color-background-layout-columns-main: var(--x-color-base-neutral-70);
    --x-color-background-layout-columns-scroll-to-top: var(--x-color-base-neutral-95);

    --x-size-margin-bottom-layout-columns-header: 2px;
    --x-size-margin-bottom-layout-columns-sub-header: 2px;
    --x-size-margin-bottom-layout-columns-toolbar: 2px;

    --x-color-border-layout-columns-header: black;
    --x-size-border-width-layout-columns-header: 1px;
    --x-color-border-layout-columns-sub-header: black;
    --x-size-border-width-layout-columns-sub-header: 1px;
    --x-color-border-layout-columns-toolbar: black;
    --x-size-border-width-layout-columns-toolbar: 1px;
    --x-color-border-layout-columns-main: black;
    --x-size-border-width-layout-columns-main: 1px;
  }
</style>
