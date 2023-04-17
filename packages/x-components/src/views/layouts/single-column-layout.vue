<template>
  <SingleColumnLayout :dev-mode="true">
    <template #header>
      <span
        class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-my-8 x-bg-neutral-10 x-title1"
      >
        HEADER
      </span>
    </template>
    <template #sub-header>
      <span
        class="x-list__item--expand x-list x-list--horizontal x-list--justify-center x-my-8 x-bg-neutral-10 x-title2"
      >
        SUB HEADER
      </span>
    </template>
    <template #toolbar>
      <div class="x-list__item--expand x-border-2 x-border-neutral-25 x-my-8 x-title3">
        TOOLBAR
        <BaseIdModalOpen modalId="extra-aside-modal" class="x-button--ghost">
          <CartIcon class="x-icon--l" />
        </BaseIdModalOpen>
      </div>
    </template>
    <template #predictive>
      <div class="x-list__item--expand x-my-8 x-title3">PREDICTIVE</div>
    </template>
    <template #floating>
      <div
        class="x-list__item--expand x-my-8 x-list x-list--horizontal x-list--justify-center x-title3"
      >
        <BaseIdModalOpen modalId="aside-modal">
          <FiltersIcon />
          FLOATING
        </BaseIdModalOpen>
      </div>
    </template>
    <template #main>
      <div class="x-list__item--stretch x-my-16 x-bg-neutral-10">
        MAIN
        <div class="x-grid-list x-grid-list--cols-auto">
          <article v-for="i in 100" :key="i" class="x-bg-neutral-25 x-pt-80 x-pl-24" />
        </div>
      </div>
    </template>
    <template #footer>
      <div
        class="x-list__item--expand x-p-8 x-bg-neutral-10 x-border-1 x-border-neutral-75 x-text1 x-text1-lg"
      >
        FOOTER
      </div>
    </template>
    <template #aside>
      <div class="x-bg-neutral-0 x-list__item--expand x-p-48">ASIDE</div>
    </template>
    <template #extra-aside>
      <BaseIdModal modal-id="extra-aside-modal" class="x-layout__aside">
        <div class="x-bg-neutral-0 x-list__item--expand x-p-48">EXTRA ASIDE</div>
      </BaseIdModal>
    </template>
  </SingleColumnLayout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { SingleColumnLayout } from '../../components';
  import FiltersIcon from '../../components/icons/filters.vue';
  import CartIcon from '../../components/icons/cart.vue';
  import BaseIdModalOpen from '../../components/modals/base-id-modal-open.vue';
  import BaseIdModal from '../../components/modals/base-id-modal.vue';

  @Component({
    components: {
      SingleColumnLayout,
      BaseIdModal,
      BaseIdModalOpen,
      CartIcon,
      FiltersIcon
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

  :root {
    --x-size-margin-left-layout-single-column: 20vw;
  }
</style>
