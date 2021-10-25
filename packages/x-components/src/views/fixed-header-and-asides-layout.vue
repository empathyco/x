<template>
  <FixedHeaderAndAsidesLayout :dev-mode="true">
    <template #header class="x-list">
      <BaseIdModalOpen modalId="left-aside">
        <Cross />
      </BaseIdModalOpen>
      <span>HEADER</span>
      <BaseIdModalOpen modalId="right-aside">
        <FiltersIcon class="x-icon--l" />
      </BaseIdModalOpen>
    </template>
    <template #sub-header>
      <span>SUB-HEADER</span>
    </template>
    <template #toolbar>
      <span>TOOLBAR</span>
    </template>
    <template #left-aside>
      <span>LEFT SIDE</span>
    </template>
    <template #right-aside>
      <span>RIGHT SIDE</span>
    </template>
    <template #main>
      <span>MAIN</span>
    </template>
    <template #scroll-to-top>
      <span>SCROLL TO TOP</span>
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
  .x-layout {
    &__header {
      background: var(--x-color-base-lead);
      justify-content: space-between;
    }
    &__sub-header {
      background: var(--x-color-base-auxiliary);
      justify-content: center;
    }
    &__toolbar {
      background: var(--x-color-base-neutral-35);
      justify-content: center;
    }
    &__main {
      background: var(--x-color-base-neutral-70);
      justify-content: center;
    }
    &__scroll-to-top {
      background: var(--x-color-base-neutral-95);
      justify-content: center;
      padding: 6px;
    }
  }
</style>
