<template>
  <SingleColumnLayout :dev-mode="true">
    <template #header>
      <span
        class="
          x-title1
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
          x-background--neutral-95
        "
      >
        HEADER
      </span>
    </template>
    <template #sub-header>
      <span
        class="
          x-title2
          x-list__item--expand
          x-list x-list--horizontal x-list--justify-center
          x-margin--bottom-03 x-margin--top-03
          x-background--neutral-95
        "
      >
        SUB HEADER
      </span>
    </template>
    <template #toolbar>
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
    <template #predictive>
      <div
        class="
          x-title3
          x-font-color--neutral-70
          x-list__item--expand
          x-margin--top-03 x-margin--bottom-03
        "
      >
        PREDICTIVE
      </div>
    </template>
    <template #floating>
      <div
        class="
          x-title3
          x-font-color--neutral-10
          x-list__item--expand
          x-margin--top-03 x-margin--bottom-03
        "
      >
        FLOATING
      </div>
    </template>
    <template #main>
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
    <template #footer>
      <div
        class="
          x-list__item--expand
          x-text
          x-padding--03
          x-margin--right-06
          x-background--neutral-95
          x-border-width--01
          x-border-color--neutral-35
        "
      >
        FOOTER
      </div>
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

<style lang="scss">
  .app {
    max-height: 100%;
    .x-layout {
      flex: 1 1 0%;
      min-height: 0;
    }
  }
</style>
