<template>
  <FixedHeaderAndAsidesLayout :dev-mode="true">
    <template #header>
      <div class="x-list x-list--horizontal x-list__item--expand x-list--align-center">
        <BaseIdModalOpen modalId="left-aside">
          <Cross />
        </BaseIdModalOpen>
        <div class="x-list__item--expand">HEADER</div>
        <BaseIdModalOpen modalId="right-aside">
          <FiltersIcon class="x-icon--l" />
        </BaseIdModalOpen>
      </div>
    </template>
    <template #sub-header>
      <div>SUB-HEADER</div>
    </template>
    <template #toolbar>
      <span>TOOLBAR</span>
    </template>
    <template #left-aside>
      <div>LEFT SIDE</div>
    </template>
    <template #right-aside>
      <div>RIGHT SIDE</div>
    </template>
    <template #main>
      <span>MAIN</span>
    </template>
    <template #scroll-to-top>
      <div
        class="
          x-background--lead
          x-border-width--02
          x-list
          x-border-width--01
          x-border-color--neutral-10
        "
      >
        SCROLL TO TOP
      </div>
    </template>
  </FixedHeaderAndAsidesLayout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import FiltersIcon from '../components/icons/filters.vue';
  import Cross from '../components/icons/cross.vue';
  import BaseIdModalOpen from '../components/modals/base-id-modal-open.vue';
  // eslint-disable-next-line max-len
  import FixedHeaderAndAsidesLayout from '../components/layouts/fixed-header-and-asides-layout.vue';
  import { XInstaller } from '../x-installer';
  import { baseInstallXOptions, baseSnippetConfig } from './base-config';

  @Component({
    components: {
      Cross,
      FixedHeaderAndAsidesLayout,
      BaseIdModalOpen,
      FiltersIcon
    },
    beforeRouteEnter(_to, _from, next: () => void): void {
      new XInstaller(baseInstallXOptions).init(baseSnippetConfig);
      next();
    }
  })
  export default class FixedHeaderAndAsidesLayoutView extends Vue {}
</script>
<style scopped lang="scss">
  :root {
    --x-color-background-layout-header: var(--x-color-base-lead);
    --x-size-border-width-layout-header: var(--x-size-base-01);
    --x-size-border-color-layout-header: var(--x-color-base-neutral-10);

    --x-color-background-layout-sub-header: var(--x-color-base-auxiliary);
    --x-size-border-width-layout-sub-header: var(--x-size-base-01);
    --x-size-border-color-layout-sub-header: var(--x-color-base-neutral-10);

    --x-color-background-layout-aside-left: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-aside-left: var(--x-size-base-01);
    --x-size-border-color-layout-aside-left: var(--x-color-base-neutral-10);

    --x-color-background-layout-aside-right: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-aside-right: var(--x-size-base-01);
    --x-size-border-color-layout-aside-right: var(--x-color-base-neutral-10);

    --x-color-background-layout-toolbar: var(--x-color-base-lead);
    --x-size-border-width-layout-toolbar: var(--x-size-base-01);
    --x-size-border-color-layout-toolbar: var(--x-color-base-neutral-10);

    --x-color-background-layout-main: var(--x-color-base-auxiliary);
    --x-size-border-width-layout-main: var(--x-size-base-01);
    --x-size-border-color-layout-main: var(--x-color-base-neutral-10);

    --x-color-background-layout-scroll-to-top: var(--x-color-base-auxiliary);
    --x-size-border-width-layout-scroll-to-top: var(--x-size-base-01);
    --x-size-border-color-layout-scroll-to-top: var(--x-color-base-neutral-10);
  }
</style>
