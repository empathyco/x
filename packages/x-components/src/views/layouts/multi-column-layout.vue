<template>
  <MultiColumnMaxWidthLayout :dev-mode="true">
    <template #header-start>
      <span
        class="x-title x-list__item--expand x-list x-list--horizontal x-list--justify-center x-mb-8 x-mt-8"
      >
        HEADER START
      </span>
    </template>
    <template #header-middle>
      <span
        class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-mb-8 x-mt-8 x-title1"
      >
        HEADER MIDDLE
      </span>
    </template>
    <template #header-end>
      <span
        class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-mb-8 x-mt-8 x-title2"
      >
        HEADER END
      </span>
    </template>
    <template #sub-header>
      <span
        class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-mb-8 x-mt-8 x-title2"
      >
        SUB HEADER
      </span>
    </template>
    <template #toolbar-aside>
      <div class="x-list__item--expand x-border-2 x-border-neutral-25 x-mt-8 x-mb-8 x-title3">
        <BaseIdTogglePanelButton class="x-button--ghost x-button" panelId="aside-panel">
          <FiltersIcon />
        </BaseIdTogglePanelButton>
        TOOLBAR ASIDE
      </div>
    </template>
    <template #toolbar-body>
      <div class="x-list__item--expand x-border-2 x-border-neutral-25 x-mt-8 x-mb-8 x-title3">
        TOOLBAR
      </div>
    </template>
    <template #main-aside>
      <div
        class="x-list__item--stretch x-mt-16 x-mb-16 x-bg-neutral-10 x-border-2 x-border-neutral-25"
      >
        MAIN ASIDE
        <article class="x-bg-neutral-25 x-pt-80 x-pl-24" />
      </div>
    </template>
    <template #main-body>
      <div class="x-list__item--stretch x-mt-16 x-mb-16 x-bg-neutral-10">
        MAIN
        <div class="x-grid-list x-grid-list--cols-auto">
          <article v-for="i in 100" :key="i" class="x-bg-neutral-25 x-pt-80 x-pl-24" />
        </div>
      </div>
    </template>
    <template #scroll-to-top>
      <ChevronUp class="x-bg-neutral-25 x-p-4 x-rounded-lg" />
    </template>
  </MultiColumnMaxWidthLayout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ChevronUp from '../../components/icons/chevron-up.vue';
  import FiltersIcon from '../../components/icons/filters.vue';
  // eslint-disable-next-line max-len
  import MultiColumnMaxWidthLayout from '../../components/layouts/multi-column-max-width-layout.vue';
  import BaseIdTogglePanelButton from '../../components/panels/base-id-toggle-panel-button.vue';

  @Component({
    components: {
      MultiColumnMaxWidthLayout,
      BaseIdTogglePanelButton,
      FiltersIcon,
      ChevronUp
    }
  })
  export default class MultiColumnLayoutView extends Vue {}
</script>

<style lang="scss">
  .app {
    max-height: 100%;

    .x-layout {
      flex: 1 1 0%;
      min-height: 0;
    }
  }
</style>

<style scopped lang="scss">
  :root {
    --x-color-background-layout-columns-header: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-columns-header: 0 0 var(--x-size-base-01);
    --x-color-border-layout-columns-header: var(--x-color-base-neutral-70);

    --x-color-background-layout-columns-sub-header: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-columns-sub-header: 0 0 var(--x-size-base-01);
    --x-color-border-layout-columns-sub-header: var(--x-color-base-neutral-70);

    --x-color-background-layout-columns-toolbar: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-columns-toolbar: 0 0 var(--x-size-base-01);
    --x-color-border-layout-columns-toolbar: var(--x-color-base-neutral-70);

    --x-color-background-layout-columns-main: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-columns-main: 0 0 var(--x-size-base-01);
    --x-color-border-layout-columns-main: var(--x-color-base-neutral-70);

    --x-color-background-layout-columns-scroll-to-top: var(--x-color-base-neutral-95);
  }
</style>
