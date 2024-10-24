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
  import { nextTick, ref, shallowRef } from 'vue';
  import BaseModal from '../../../../x-components/src/components/modals/base-modal.vue';
  import { animateClipPath } from '../../../../x-components/src/components/animations/animate-clip-path/animate-clip-path.factory';
  import { animateScale } from '../../../../x-components/src/components/animations/animate-scale/animate-scale.factory';
  import { animateTranslate } from '../../../../x-components/src/components/animations/animate-translate/animate-translate.factory';

  const clipPathAnimation = animateClipPath('left');
  const scaleAnimation = animateScale('bottom');
  const translateAnimation = animateTranslate('right');

  const currentAnimation = shallowRef(scaleAnimation);
  const open = ref(false);

  /** Open modal with ClipPath animation. */
  async function openWithClipPath() {
    currentAnimation.value = clipPathAnimation;
    await nextTick();
    open.value = true;
  }

  /** Open modal with Scale animation. */
  async function openWithScale() {
    currentAnimation.value = scaleAnimation;
    await nextTick();
    open.value = true;
  }

  /** Open modal with Translate animation. */
  async function openWithTranslate() {
    currentAnimation.value = translateAnimation;
    await nextTick();
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
