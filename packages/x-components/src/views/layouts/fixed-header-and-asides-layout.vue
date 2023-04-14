<template>
  <FixedHeaderAndAsidesLayout :dev-mode="true">
    <template #header>
      <div class="x-list x-list--horizontal x-list__item--expand x-list--align-center">
        <BaseIdModalOpen modalId="left-aside" class="x-button--ghost">
          <ChevronRight />
        </BaseIdModalOpen>
        <span
          class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-title1"
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
      <span class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-title2">
        SUB-HEADER
      </span>
    </template>
    <template #toolbar>
      <div class="x-list__item--expand x-border-2 x-border-neutral-25 x-mt-8 x-title3">TOOLBAR</div>
    </template>
    <template #left-aside>
      <div class="x-bg-neutral-0 x-list__item--expand x-rounded-r-lg x-padding--05">LEFT SIDE</div>
    </template>
    <template #right-aside>
      <div class="x-bg-neutral-0 x-padding--10 x-mt-80 x-rounded-l-lg">RIGHT SIDE</div>
    </template>
    <template #extra-aside>
      <BaseIdModal modal-id="extra-aside" class="x-layout__aside x-layout__aside--right">
        <div class="x-bg-neutral-0 x-padding--10 x-mt-80 x-rounded-l-lg">EXTRA ASIDE</div>
      </BaseIdModal>
    </template>
    <template #main>
      <div class="x-list__item--stretch x-mt-16 x-mb-16 x-bg-neutral-10">
        MAIN
        <div class="x-grid-list x-grid-list--cols-auto">
          <article
            v-for="i in 100"
            :key="i"
            class="x-bg-neutral-25 x-padding--top-13 x-padding--left-6"
          />
        </div>
      </div>
    </template>
    <template #scroll-to-top>
      <div class="x-padding--03 x-bg-neutral-10 x-border-1 x-border-neutral-75 x-text1 x-text1-lg">
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
