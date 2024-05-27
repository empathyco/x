<template>
  <button @click="devMode = !devMode">{{ devMode ? 'Hide slots' : 'Show slots' }}</button>
  <header v-if="hasContent('header')">
    <!-- @slot Slot that is used to insert content into the Header. -->
    <slot name="header">
      <span v-if="devMode">HEADER</span>
    </slot>
  </header>

  <div v-if="hasContent('sub-header')">
    <!-- @slot Slot that can be used to insert content into the Sub Header. -->
    <slot name="sub-header">
      <span v-if="devMode">SUB HEADER</span>
    </slot>
  </div>

  <main v-if="hasContent('main')" class="x-layout__main">
    <!-- @slot Slot that can be used to insert content into the Main. -->
    <slot name="main">
      <span v-if="devMode">MAIN</span>
    </slot>
  </main>
</template>

<script setup>
  import { useSlots, ref } from 'vue';
  import { useLayouts } from '../../../x-components/src/components/layouts/use-layouts';

  const slots = useSlots();

  const devMode = ref(true);

  const { hasContent } = useLayouts(devMode.value, slots);
</script>

<style scoped></style>
