<template>
  <MultiColumnMaxWidthLayout :dev-mode="true">
    <template #header-start>
      <span
        class="
          x-title
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
        "
      >
        HEADER START
      </span>
    </template>
    <template #header-middle>
      <span
        class="
          x-title1
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
        "
      >
        HEADER MIDDLE
      </span>
    </template>
    <template #header-end>
      <span
        class="
          x-title2
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
        "
      >
        HEADER END
      </span>
    </template>
    <template #sub-header>
      <span
        class="
          x-title2
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
        "
      >
        SUB HEADER
      </span>
    </template>
    <template #toolbar-aside>
      <div
        class="
          x-title3
          x-font-color--neutral-70
          x-list__item--expand
          x-border-width--02
          x-border-color--neutral-70
          x-margin--top-03 x-margin--bottom-03
        "
      >
        <BaseIdTogglePanelButton class="x-button x-button--ghost" panelId="aside-panel">
          <FiltersIcon />
        </BaseIdTogglePanelButton>
        TOOLBAR ASIDE
      </div>
    </template>
    <template #toolbar-body>
      <div
        class="
          x-title3
          x-font-color--neutral-70
          x-list__item--expand
          x-border-width--02
          x-border-color--neutral-70
          x-margin--top-03 x-margin--bottom-03
        "
      >
        TOOLBAR
      </div>
    </template>
    <template #main-aside>
      <div
        class="
          x-list__item--stretch
          x-margin--top-05 x-margin--bottom-05
          x-background--neutral-95
          x-border-width--02
          x-border-color--neutral-70
        "
      >
        MAIN ASIDE
        <article class="x-background--neutral-70 x-padding--top-13 x-padding--left-6" />
      </div>
    </template>
    <template #main-body>
      <div
        class="x-list__item--stretch x-margin--top-05 x-margin--bottom-05 x-background--neutral-95"
      >
        MAIN
        <div class="x-grid x-grid--cols-auto">
          <article
            v-for="i in 100"
            :key="i"
            class="x-background--neutral-70 x-padding--top-13 x-padding--left-6"
          />
        </div>
      </div>
    </template>
    <template #scroll-to-top>
      <ChevronUp class="x-background--neutral-70 x-padding--02 x-border-radius--06" />
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
