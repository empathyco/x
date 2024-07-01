<template>
  <SearchInput />
  <Redirection
    #default="{ redirection, redirect, abortRedirect }"
    class="redirection-container"
    :delayInSeconds="5"
  >
    <p>Your search matches a special place in our website. You are being redirected to:</p>
    <a @click="redirect" :href="redirection.url" data-test="redirection-link">
      {{ redirection.url }}
    </a>
    <div>
      <button @click="abortRedirect">No, I'll stay here</button>
      <button @click="redirect">Yes, redirect me</button>
    </div>
  </Redirection>
</template>

<script setup>
  import Redirection from '../../../../../x-components/src/x-modules/search/components/redirection.vue';
  import SearchInput from '../../../../../x-components/src/x-modules/search-box/components/search-input.vue';
</script>

<style>
  .redirection-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: antiquewhite;
    width: fit-content;
    padding: 0 10px 10px 10px;
    margin-top: 15px;
  }
</style>
