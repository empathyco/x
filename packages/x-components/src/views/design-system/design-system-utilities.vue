<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Utilities</h1>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Background Color</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="color in colors"
          :key="color"
          class="x-padding--06"
          :class="'x-background--' + color"
        >
          Background {{ color }}
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Color</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="color in colors"
          :key="color"
          class="x-padding--06 x-border-width--03"
          :class="'x-border-color--' + color"
        >
          Border Color {{ color }}
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Width</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="width in borderSizes"
          :key="width"
          class="x-padding--06 x-border-color--lead"
          :class="'x-border-width--' + width"
        >
          Border Width {{ width }}
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Width Individual</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div class="x-padding--06 x-border-width--top-01 x-border-color--lead">
          Border Width Top 01
        </div>
        <div class="x-padding--06 x-border-width--right-02 x-border-color--lead">
          Border Width Right 02
        </div>
        <div class="x-padding--06 x-border-width--bottom-03 x-border-color--lead">
          Border Width Bottom 03
        </div>
        <div class="x-padding--06 x-border-width--left-04 x-border-color--lead">
          Border Width Left 04
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Width Combinations</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          class="
            x-list
            x-padding--06
            x-border-width--10 x-border-width--left-01 x-border-width--right-02
            x-border-color--lead
          "
        >
          <span>Border Width 10</span>
          <span>Border Width Left 01</span>
          <span>Border Width Right 02</span>
        </div>
        <div
          class="
            x-list
            x-padding--06
            x-border-width--top-10
            x-border-width--bottom-05
            x-border-width--left-01
            x-border-width--right-03
            x-border-color--lead
          "
        >
          <span>Border Width Top 10</span>
          <span>Border Width Bottom 05</span>
          <span>Border Width Left 01</span>
          <span>Border Width Right 03</span>
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Radius</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="size in sizes"
          :key="size"
          class="x-padding--10 x-border-width--01 x-border-color--lead"
          :class="'x-border-radius--' + size"
        >
          Border Radius {{ size }}
        </div>
        <div class="x-padding--10 x-border-width--01 x-border-color--lead x-border-radius--pill">
          Border Radius Pill
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Radius Sides</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--top-03
          "
        >
          Border Radius Top 03
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--right-04
          "
        >
          Border Radius Right 04
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--bottom-05
          "
        >
          Border Radius Bottom 05
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--left-06
          "
        >
          Border Radius Left 06
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Radius Individuals</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--top-left-03
          "
        >
          Border Radius Top Left 03
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--top-right-04
          "
        >
          Border Radius Top Right 04
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--bottom-right-05
          "
        >
          Border Radius Bottom Right 05
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--bottom-left-06
          "
        >
          Border Radius Bottom Left 06
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Border Radius Combinations</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--04 x-border-radius--top-left-08 x-border-radius--bottom-right-08
          "
        >
          <span>Border Radius 04</span>
          <span>Border Radius Top Left 08</span>
          <span>Border Radius Bottom Right 08</span>
        </div>
        <div
          class="
            x-list
            x-padding--10
            x-border-width--01
            x-border-color--lead
            x-border-radius--top-left-02
            x-border-radius--top-right-04
            x-border-radius--bottom-right-08
            x-border-radius--bottom-left-10
          "
        >
          <span>Border Radius Top Left 02</span>
          <span>Border Radius Top Right 04</span>
          <span>Border Radius Bottom Right 08</span>
          <span>Border Radius Bottom Left 10</span>
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Shadow</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div class="x-padding--06 x-shadow--none">Shadow none</div>
        <div
          v-for="size in shadowsSizes"
          :key="size"
          class="x-padding--06"
          :class="'x-shadow--' + size"
        >
          Shadow {{ size }}
        </div>
      </div>

      <h3 class="x-title3">Shadow Bottom</h3>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="size in shadowsSizes"
          :key="size"
          class="x-padding--06"
          :class="'x-shadow--bottom-' + size"
        >
          Shadow Bottom {{ size }}
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Font Color</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div
          v-for="color in colors"
          :key="color"
          class="x-padding--06"
          :class="'x-font-color--' + color"
        >
          Font Color {{ color }}
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Font Weight</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div class="x-padding--06 x-font-weight--light">Font Weight Light</div>
        <div class="x-padding--06 x-font-weight--regular">Font Weight Regular</div>
        <div class="x-padding--06 x-font-weight--bold">Font Weight Bold</div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Padding</h2>
      <div
        v-for="size in sizes"
        :key="size"
        class="x-background--neutral-70"
        :class="' x-padding--' + size"
      >
        <div class="x-background--neutral-100">Padding {{ size }}</div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Padding Individuals</h2>
      <div class="x-background--neutral-70 x-padding--top-01">
        <div class="x-background--neutral-100">Padding Top 01</div>
      </div>
      <div class="x-background--neutral-70 x-padding--right-02">
        <div class="x-background--neutral-100">Padding Right 02</div>
      </div>
      <div class="x-background--neutral-70 x-padding--bottom-03">
        <div class="x-background--neutral-100">Padding Bottom 03</div>
      </div>
      <div class="x-background--neutral-70 x-padding--left-04">
        <div class="x-background--neutral-100">Padding Left 04</div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Margin</h2>
      <div v-for="size in sizes" :key="size" class="x-background--neutral-70">
        <div class="x-background--neutral-100" :class="' x-margin--' + size">Margin {{ size }}</div>
      </div>
    </article>

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Margin Individuals</h2>
      <div class="x-background--neutral-70">
        <div class="x-background--neutral-100 x-margin--top-01">Margin Top 01</div>
      </div>
      <div class="x-background--neutral-70">
        <div class="x-background--neutral-100 x-margin--right-02">Margin Right 02</div>
      </div>
      <div class="x-background--neutral-70">
        <div class="x-background--neutral-100 x-margin--bottom-03">Margin Bottom 03</div>
      </div>
      <div class="x-background--neutral-70">
        <div class="x-background--neutral-100 x-margin--left-04">Margin Left 04</div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class DesignSystemUtilities extends Vue {
    protected colors = [
      'lead',
      'auxiliary',
      'neutral-10',
      'neutral-35',
      'neutral-70',
      'neutral-95',
      'neutral-100',
      'accent',
      'enable',
      'disable'
    ];

    protected maxSize = 20;

    protected get sizes(): string[] {
      return Array.from({ length: this.maxSize + 1 }, (_, index) => String(index).padStart(2, '0'));
    }

    protected get borderSizes(): string[] {
      return this.sizes.slice(0, 11);
    }

    protected get shadowsSizes(): string[] {
      return this.sizes.slice(1, 11);
    }
  }
</script>

<style lang="scss">
  .x-background--neutral-10 {
    color: var(--x-color-base-neutral-100);
  }

  .x-font-color--neutral-100,
  .x-font-color--neutral-95 {
    background-color: var(--x-color-base-neutral-70);
  }
</style>
