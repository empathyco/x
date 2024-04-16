<template>
  <div id="app">
    <h1>vue3-migration-test</h1>
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

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'App'
  });
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
