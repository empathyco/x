<template>
  <div class="animate-modal">
    <p>
      BREAKING Vue3: `h()` hyperscript doesn't support rendering `'transition'` using strings.
      Instead, replace it by `Transition` component of Vue 3 itself `import { Transition } from
      'vue'`.
      <br />
      <a href="https://github.com/vuejs/core/issues/826#issuecomment-598207464">
        https://github.com/vuejs/core/issues/826#issuecomment-598207464
      </a>
      <br />
      <a href="https://github.com/vuejs/test-utils/issues/471#issuecomment-804477181">
        https://github.com/vuejs/test-utils/issues/471#issuecomment-804477181
      </a>
    </p>
    <p>
      BREAKING Vue3: Review Transition Class Change. Replace instances of `.v-enter` to
      `.v-enter-from` Replace instances of `.v-leave` to `.v-leave-from`.
      <br />
      <a href="https://v3-migration.vuejs.org/breaking-changes/transition.html">
        https://v3-migration.vuejs.org/breaking-changes/transition.html
      </a>
    </p>
    <p>
      BREAKING Vue3: VNodes now have a flat props structure.
      <br />
      <a
        href="https://v3-migration.vuejs.org/breaking-changes/render-function-api.html#vnode-props-format"
      >
        https://v3-migration.vuejs.org/breaking-changes/render-function-api.html#vnode-props-format
      </a>
    </p>
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

  const clipPathAnimation = animateClipPath('bottom');
  const scaleAnimation = animateScale('bottom');
  const translateAnimation = animateTranslate('bottom');

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
