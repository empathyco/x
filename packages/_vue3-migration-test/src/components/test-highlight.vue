<template>
  <Highlight
    :text="'Almendra garrapiñada'"
    :highlight="'men'"
    match-class="match-class"
    no-match-class="no-match-class"
    matching-part-class="matching-part-class"
  />
  <br />
  <Highlight
    :text="'Almendra garrapiñada'"
    :highlight="'tar'"
    match-class="match-class"
    no-match-class="no-match-class"
    matching-part-class="matching-part-class"
  />
</template>

<script setup lang="ts">
  import Highlight from '../../../x-components/src/components/highlight.vue';
</script>

<style>
  .match-class {
    color: red;
  }
  .matching-part-class {
    color: greenyellow;
  }
  .no-match-class {
    color: blue;
  }
</style>
