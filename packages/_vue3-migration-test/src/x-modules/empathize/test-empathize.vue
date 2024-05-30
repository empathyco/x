<template>
  <SearchInput />
  <Empathize :animation="CollapseHeight" class="empathize">
    <div v-if="showContent">
      <h1>It is a Empathize</h1>
      <h2>It is a Empathize</h2>
      <h3>It is a Empathize</h3>
      <p>
        Component containing the empathize. It has a required slot to define its content and two
        props to define when to open and close it: `eventsToOpenEmpathize` and
        `eventsToCloseEmpathize`.
      </p>
    </div>
  </Empathize>
  <Empathize :animation="CollapseHeight" class="empathize" />
  <button @click="toggleContent">
    {{ showContent ? 'hide empathize content' : 'show empathize content' }}
  </button>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import CollapseHeight from '../../../../x-components/src/components/animations/collapse-height.vue';
  import Empathize from '../../../../x-components/src/x-modules/empathize/components/empathize.vue';
  import SearchInput from '../../../../x-components/src/x-modules/search-box/components/search-input.vue';

  const showContent = ref(true);
  const toggleContent = () => {
    showContent.value = !showContent.value;
  };
</script>

<style scoped>
  .empathize {
    border: 3px solid red;
    padding-top: 16px;
    padding-bottom: 16px;
  }
</style>
