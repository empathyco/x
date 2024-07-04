<template>
  <div class="animate-modal">
    <OpenMainModal>Open X</OpenMainModal>
    <MainModal contentClass="content-animation-clip" :animation="modalAnimation">
      <h1>Hello</h1>
      <p>The modal is working</p>
      <CloseMainModal>Close X</CloseMainModal>
    </MainModal>
  </div>
</template>

<script setup lang="ts">
  import MainModal from '../../../../x-components/src/components/modals/main-modal.vue';
  import CloseMainModal from '../../../../x-components/src/components/modals/close-main-modal.vue';
  import OpenMainModal from '../../../../x-components/src/components/modals/open-main-modal.vue';
  import { animateClipPath } from '../../../../x-components/src/components/animations/animate-clip-path/animate-clip-path.factory';

  const modalAnimation = animateClipPath('bottom');
</script>

<style>
  .animate-modal {
    .content-animation-clip {
      background: white;
      margin: auto;
      height: 300px;
      width: 800px;
      border: 3px solid green;
      padding: 10px;
    }

    .overlay {
      background-color: red;
    }
  }
</style>
