<template>
  <div class="animate-modal">
    <button @click="openWithClipPath">Open modal with CLIP PATH animation</button>
    <button @click="openWithScale">Open modal with SCALE animation</button>
    <button @click="openWithTranslate">Open modal with TRANSLATE animation</button>
    <BaseModal
      @click:overlay="open = false"
      @focusin:body="open = false"
      :open="open"
      :animation="currentAnimation"
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
  import { ref, shallowRef } from 'vue';
  import BaseModal from '../../../../x-components/src/components/modals/base-modal.vue';
  import { animateClipPath } from '../../../../x-components/src/components/animations/animate-clip-path/animate-clip-path.factory';
  import { animateScale } from '../../../../x-components/src/components/animations/animate-scale/animate-scale.factory';
  import { animateTranslate } from '../../../../x-components/src/components/animations/animate-translate/animate-translate.factory';

  const clipPathAnimation = animateClipPath('left');
  const scaleAnimation = animateScale('bottom');
  const translateAnimation = animateTranslate('right');

  const currentAnimation = shallowRef(clipPathAnimation);
  const open = ref(false);

  /** Open modal with ClipPath animation. */
  function openWithClipPath() {
    currentAnimation.value = clipPathAnimation;
    open.value = true;
  }

  /** Open modal with Scale animation. */
  function openWithScale() {
    currentAnimation.value = scaleAnimation;
    open.value = true;
  }

  /** Open modal with Translate animation. */
  function openWithTranslate() {
    currentAnimation.value = translateAnimation;
    open.value = true;
  }
</script>

<style>
  .animate-modal {
    .content {
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
