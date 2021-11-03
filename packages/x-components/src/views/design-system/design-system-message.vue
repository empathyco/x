<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Message</h1>

    <article class="x-list x-list__item--stretch x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Default</h2>
      <div class="x-message x-list__item--stretch">
        <p>
          Your search matches a special place in our website, to visit it, your are being redirected
        </p>
        <a href="https://empathy.co">https://empathy.co</a>
        <div class="x-list x-list--horizontal x-list--gap-07">
          <button class="x-button x-button--ghost x-font-color--neutral-70">
            No, I'll stay here
          </button>
          <button class="x-button x-button--ghost x-font-color--neutral-10">
            Yes, redirect me
          </button>
        </div>
        <AutoProgressBar :isLoading="true" :durationInSeconds="50" />
      </div>

      <div class="x-message x-list__item--stretch">
        <p>
          There are no results for
          <span class="x-font-weight--bold">query</span>
        </p>
        <p>You may be interested in these:</p>
      </div>
    </article>

    <article class="x-list x-list__item--stretch x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Playing with tokens</h2>

      <div
        class="x-message x-list__item--stretch"
        style="
          --x-color-background-message-default: var(--x-color-base-auxiliary);
          --x-color-border-message-default: var(--x-color-base-lead);
          --x-size-border-width-top-message-default: var(--x-size-base-01);
          --x-size-border-width-right-message-default: var(--x-size-base-02);
          --x-size-border-width-bottom-message-default: var(--x-size-base-02);
          --x-size-border-width-left-message-default: var(--x-size-base-01);
          --x-color-text-message-default: var(--x-color-base-neutral-100);
          --x-size-border-radius-top-right-message-default: 0;
          --x-size-border-radius-bottom-left-message-default: 0;
          --x-size-padding-message-default: var(--x-size-base-07);
          --x-number-font-weight-message-default: var(--x-number-font-weight-base-bold);
          --x-size-font-message-default: var(--x-size-font-base-s);
        "
      >
        <p>
          There are no results for
          <span class="x-font-weight--light">query</span>
        </p>
        <p>You may be interested in these:</p>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import AutoProgressBar from '../../components/auto-progress-bar.vue';

  @Component({ components: { AutoProgressBar } })
  export default class DesignSystemMessage extends Vue {}
</script>

<style lang="scss"></style>
