<template>
  <div>
    <nav>
      <!-- Intentionally using an `a` element instead of `router-link` to perform a full refresh -->
      <a v-for="route in $router.options.routes" :key="route.name" class="link" :href="route.path">
        {{ route.name }}
      </a>
    </nav>
    <router-view />
  </div>
</template>

<script>
  import './styles/themes/default.scss';
  export default {};
</script>

<style lang="scss" scoped>
  .link {
    display: inline-block;
    margin: 0.5em 1em 1em 0;
    color: darkgrey;
    text-decoration: none;
    font-family: sans-serif;
  }
</style>
