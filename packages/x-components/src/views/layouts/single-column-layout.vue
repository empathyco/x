<template>
  <SingleColumnLayout :dev-mode="true">
    <template #header>
      <span>HEADER</span>
    </template>
    <template #sub-header>SUB HEADER</template>
    <template #toolbar>
      <span>TOOLBAR ASIDE</span>
    </template>
    <template #predictive>
      <span>PREDICTIVE</span>
    </template>
    <template #main>
      <span>MAIN</span>
    </template>
    <template #floating>
      <span>FLOATING</span>
    </template>
    <template #main>
      <span>MAIN</span>
    </template>
    <template #footer>
      <span>FOOTER</span>
    </template>
    <template #aside>
      <span>ASIDE</span>
    </template>
  </SingleColumnLayout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SingleColumnLayout } from '../../components';
  import FiltersIcon from '../../components/icons/filters.vue';
  import Cross from '../../components/icons/cross.vue';
  import BaseIdModalOpen from '../../components/modals/base-id-modal-open.vue';
  // eslint-disable-next-line max-len
  import { XInstaller } from '../../x-installer';
  import { baseInstallXOptions, baseSnippetConfig } from '../base-config';

  @Component({
    components: {
      Cross,
      SingleColumnLayout,
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
  .x-layout {
    &__header {
      background: var(--x-color-base-lead);
    }
    &__sub-header {
      background: var(--x-color-base-auxiliary);
    }
    &__toolbar {
      background: var(--x-color-base-neutral-35);
    }
    &__main {
      background: var(--x-color-base-neutral-70);
    }
  }
</style>
