<template>
  <FixedHeaderAndAsidesLayout :dev-mode="true">
    <template #header>
      <div class="x-list x-list--horizontal x-list__item--expand x-list--align-center">
        <BaseIdModalOpen modalId="left-aside" class="x-button--ghost">
          <ChevronRight />
        </BaseIdModalOpen>
        <span
          class="x-title1 x-list__item--expand x-list x-list--horizontal x-list--justify-center"
        >
          HEADER
        </span>
        <BaseIdModalOpen modalId="right-aside" class="x-button--ghost">
          <FiltersIcon class="x-icon--l" />
        </BaseIdModalOpen>
        <BaseIdModalOpen modalId="extra-aside" class="x-button--ghost">
          <CartIcon class="x-icon--l" />
        </BaseIdModalOpen>
      </div>
    </template>
    <template #sub-header>
      <span class="x-title2 x-list__item--expand x-list x-list--horizontal x-list--justify-center">
        SUB-HEADER
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
          x-margin--top-03
        "
      >
        TOOLBAR
      </div>
    </template>
    <template #left-aside>
      <div
        class="
          x-background--neutral-100
          x-list__item--expand
          x-border-radius--right-06
          x-padding--05
        "
      >
        LEFT SIDE
      </div>
    </template>
    <template #right-aside>
      <div
        class="x-background--neutral-100 x-padding--10 x-margin--top-12 x-border-radius--left-06"
      >
        RIGHT SIDE
      </div>
    </template>
    <template #extra-aside>
      <BaseIdModal modal-id="extra-aside" class="x-layout__aside x-layout__aside--right">
        <div
          class="x-background--neutral-100 x-padding--10 x-margin--top-12 x-border-radius--left-06"
        >
          EXTRA ASIDE
        </div>
      </BaseIdModal>
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
    <template #scroll-to-top>
      <div
        class="
          x-text
          x-padding--03
          x-background--neutral-95
          x-border-width--01
          x-border-color--neutral-35
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
  import ChevronRight from '../../components/icons/chevron-right.vue';
  import Cross from '../../components/icons/cross.vue';
  import FiltersIcon from '../../components/icons/filters.vue';
  import CartIcon from '../../components/icons/cart.vue';
  // eslint-disable-next-line max-len
  import FixedHeaderAndAsidesLayout from '../../components/layouts/fixed-header-and-asides-layout.vue';
  import BaseIdModalOpen from '../../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../../components/modals/base-id-modal.vue';

  @Component({
    components: {
      ChevronRight,
      Cross,
      FixedHeaderAndAsidesLayout,
      BaseIdModal,
      BaseIdModalOpen,
      FiltersIcon,
      CartIcon
    }
  })
  export default class FixedHeaderAndAsidesLayoutView extends Vue {}
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
    --x-color-background-layout-header: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-header: 0 0 var(--x-size-base-01);
    --x-size-border-color-layout-header: var(--x-color-base-neutral-70);

    --x-color-background-layout-sub-header: var(--x-color-base-neutral-95);
    --x-size-border-width-layout-sub-header: 0 0 var(--x-size-base-01);
    --x-size-border-color-layout-sub-header: var(--x-color-base-neutral-70);
  }
</style>
