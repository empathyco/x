<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Sliding panel</h1>
    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <SlidingPanel>
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Buttons overflow</h2>
      <SlidingPanel class="x-sliding-panel--buttons-overflow">
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">No gradient</h2>
      <SlidingPanel class="x-sliding-panel--no-gradient">
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Buttons visible on hover</h2>
      <SlidingPanel class="x-sliding-panel--show-buttons-on-hover">
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Buttons visible on hover with overflow</h2>
      <SlidingPanel
        class="x-sliding-panel--show-buttons-on-hover x-sliding-panel--buttons-overflow"
      >
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Buttons visible on hover, with overflow and no gradient</h2>
      <SlidingPanel
        class="
          x-sliding-panel--no-gradient
          x-sliding-panel--show-buttons-on-hover
          x-sliding-panel--buttons-overflow
        "
      >
        <template #sliding-panel-left-button>
          <ChevronLeftIcon />
        </template>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Bogotá</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Baghdad</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Nairobi</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ankara</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Thais</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Edron</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Venore</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Carlin</span>
        </button>
        <button class="x-button x-button--tertiary x-button--card">
          <PlusIcon />
          <span>Ab'Dendriel</span>
        </button>
        <template #sliding-panel-right-button>
          <ChevronRightIcon />
        </template>
      </SlidingPanel>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import ChevronLeftIcon from '../../components/icons/chevron-left.vue';
  import ChevronRightIcon from '../../components/icons/chevron-right.vue';
  import PlusIcon from '../../components/icons/plus.vue';
  import SlidingPanel from '../../components/sliding-panel.vue';

  @Component({
    components: {
      ChevronLeftIcon,
      ChevronRightIcon,
      PlusIcon,
      SlidingPanel
    }
  })
  export default class DesignSystemSlidingPanel extends Vue {}
</script>

<style lang="scss" scoped>
  @import '../../design-system/mixins';

  .x-sliding-panel {
    max-width: 500px;

    ::v-deep .x-sliding-panel__scroll {
      gap: var(--x-size-base-03);
      @include safari-gap(var(--x-size-base-03));
    }
  }
</style>
