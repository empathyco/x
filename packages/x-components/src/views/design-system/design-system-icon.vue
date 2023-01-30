<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Icons</h1>
    <template v-for="size in sizes">
      <h2 :key="'h2' + size" class="x-title2 x-uppercase">{{ size }}</h2>
      <ul :key="size" class="x-list x-list--wrap x-list--gap-06">
        <li v-for="(icon, id) in icons" :key="id" :title="id">
          <component :is="icon" :class="'x-icon--' + size" />
        </li>
      </ul>
    </template>
    <h2 class="x-title2 x-uppercase">Fill</h2>
    <ul class="x-list x-list--wrap x-list--gap-06">
      <li v-for="(icon, id) in icons" :key="id" :title="id">
        <component :is="icon" class="x-fill--accent x-icon--xl" />
      </li>
    </ul>
  </section>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import * as Icons from '../../components/icons';

  @Component
  export default class DesignSystemIcon extends Vue {
    protected icons = Icons;
    protected sizes = ['s', 'm', 'l', 'xl'];
  }
</script>
