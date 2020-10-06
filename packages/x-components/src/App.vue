<template>
  <main>
    <a class="link" href="/">FullApp.vue</a>
    <a class="link" href="/full-empathize">FullEmpathize.vue</a>
    <a class="link" href="/full-no-empathize">FullNoEmpathize.vue</a>
    <a class="link" href="/result-app">ResultApp.vue</a>
    <router-view />
  </main>
</template>

<style scoped>
  .link {
    display: inline-block;
    margin: 0.5em 1em 1em 0;
    color: darkgrey;
    text-decoration: none;
    font-family: sans-serif;
  }
</style>
