<template>
  <div class="base-id-modal">
    <BaseIdModalOpen modalId="myModal">Open</BaseIdModalOpen>
    <BaseIdModal :animation="Fade" modalId="myModal" contentClass="content" overlayClass="overlay">
      <h1>Hello</h1>
      <p>The base id modal is working</p>
      <BaseIdModalClose modalId="myModal">Close</BaseIdModalClose>
    </BaseIdModal>
  </div>
</template>

<script setup lang="ts">
  import BaseIdModal from '../../../../x-components/src/components/modals/base-id-modal.vue';
  import BaseIdModalOpen from '../../../../x-components/src/components/modals/base-id-modal-open.vue';
  import BaseIdModalClose from '../../../../x-components/src/components/modals/base-id-modal-close.vue';
  import Fade from '../../../../x-components/src/components/animations/fade.vue';
</script>

<style>
  .base-id-modal {
    .content {
      background: white;
      margin: auto;
      width: 50%;
      border: 3px solid green;
      padding: 10px;
    }

    .overlay {
      background-color: red;
    }
  }
</style>
