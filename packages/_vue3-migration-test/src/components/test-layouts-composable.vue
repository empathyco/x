<template>
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
  import { useLayouts } from '../../../x-components/src/components/layouts/use-layouts';

  const slots = defineSlots();

  const props = defineProps({
    devMode: {
      type: Boolean,
      default: true
    }
  });

  const { hasContent } = useLayouts(props.devMode, slots);
</script>

<style scoped></style>
