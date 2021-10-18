<template>
  <FixedHeaderAndAsidesLayout :dev-mode="true">
    <template #header>
      <span class="x-list x-list--horizontal x-list__item--expand x-list--justify-center">
        <BaseIdModalOpen modalId="left-aside">
          <Cross />
        </BaseIdModalOpen>
        <span style="margin: 0 auto">HEADER</span>
        <BaseIdModalOpen modalId="right-aside">
          <FiltersIcon class="x-icon--l" />
        </BaseIdModalOpen>
      </span>
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
  export default class FixedHeaderAndAsidesLayoutDemo extends Vue {}
</script>
