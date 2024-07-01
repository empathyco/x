<template>
  <div id="app">
    <h1 class="header">vue3-migration-test</h1>
    <nav>
      <RouterLink v-for="route in $router.options.routes" :key="route.path" :to="route.path">
        {{ route.name }}
      </RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { provide } from 'vue';
  import { baseSnippetConfig } from '../../x-components/src/views/base-config';

  /**
   * TODO: remove when x-instaler is migrated and used in this Playground.
   * X-instaler's `createApp` fn should provide the snippet config.
   */
  provide('snippetConfig', baseSnippetConfig);
</script>

<style lang="scss" scoped>
  #app {
    nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin: 1rem 0;
    }
  }
</style>
