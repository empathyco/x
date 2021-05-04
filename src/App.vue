<template>
  <div>
    <BaseIdModalOpen modalId="x-components-app">Open X</BaseIdModalOpen>

    <BaseIdModal
      @click.stop.native
      class="x-modal"
      modalId="x-components-app"
      :animation="collapseFromTop"
    >
      <Layout />
    </BaseIdModal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { BaseIdModalOpen, BaseIdModal, CollapseFromTop } from '@empathy/x-components';
  import Layout from '@/components/layout.vue';

  @Component({
    components: {
      Layout,
      BaseIdModalOpen,
      BaseIdModal
    }
  })
  export default class Layer extends Vue {
    protected collapseFromTop = CollapseFromTop;
  }
</script>

<style scoped>
  .x-modal::v-deep .x-modal__content {
    width: 100%;
    height: 100%;
    background-color: white;
    overflow: auto;
  }
</style>
