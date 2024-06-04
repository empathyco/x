<template>
  <div class="base-modal">
    <button @click="openModal">Open modal</button>
    <BaseEventsModal
      :animation="Fade"
      :focusOnOpen="true"
      v-bind="$attrs"
      contentClass="content"
      overlayClass="overlay"
    >
      <h1>Hello</h1>
      <p>The modal is working with events!!</p>
      <button @click="closeModal">Close modal</button>
    </BaseEventsModal>
  </div>
</template>

<script setup lang="ts">
  import BaseEventsModal from '../../../../x-components/src/components/modals/base-events-modal.vue';
  import Fade from '../../../../x-components/src/components/animations/fade.vue';
  import { use$x } from '../../../../x-components/src/composables/use-$x';
  const _$x = use$x();

  const openModal = () => _$x.emit('UserClickedOpenEventsModal');

  const closeModal = () => _$x.emit('UserClickedCloseEventsModal');
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
      background-color: #00ff80;
    }
  }
</style>
