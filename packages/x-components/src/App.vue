<template>
  <div class="app">
    <nav>
      <!-- Intentionally using an `a` element instead of `router-link` to perform a full refresh -->
      <a v-for="route in $router.options.routes" :key="route.name" class="link" :href="route.path">
        {{ route.name }}
      </a>
    </nav>
    <h1 class="xds:flex xds:text-fabada xds:text-5xl">DEMO TESTING</h1>
    <router-view />
  </div>
</template>

<style lang="css">
html,
body {
  margin: 0;
  height: 100%;
}
</style>

<style lang="css" scoped>
.app {
  min-height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
.link {
  display: inline-block;
  margin: 0.5em 1em 1em 0;
  color: darkgrey;
  text-decoration: none;
  font-family: sans-serif;
}
</style>
