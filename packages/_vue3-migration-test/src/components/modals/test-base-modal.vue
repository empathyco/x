<template>
  <div class="base-modal">
    <button @click="open = true">Open modal</button>
    <BaseModal
      @click:overlay="open = false"
      @focusin:body="open = false"
      :open="open"
      :focusOnOpen="true"
      referenceSelector=".header"
      :animation="Fade"
      :overlayAnimation="Fade"
      contentClass="content"
      overlayClass="overlay"
    >
      <h1>Hello</h1>
      <p>The modal is working</p>
      <button @click="open = false">Close modal</button>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BaseModal from '../../../../x-components/src/components/modals/base-modal.vue';
  import Fade from '../../../../x-components/src/components/animations/fade.vue';

  const open = ref(false);
</script>

<style>
  .base-modal {
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
