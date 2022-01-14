<template>
  <section class="x-list x-padding--07 x-list--gap-05 x-list--justify-start x-list--align-start">
    <h1 class="x-title1">Utilities</h1>

    <article class="x-list x-list--vertical x-self-stretch x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Flex</h2>
      <div
        class="
          x-list x-list--horizontal x-list--gap-03
          x-self-stretch
          x-padding--02
          x-background--neutral-95
        "
      >
        <div class="x-flex-1 x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-flex-1
        </div>
        <div class="x-flex-auto x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-flex-auto
        </div>
        <div class="x-flex-initial x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-flex-initial
        </div>
        <div class="x-flex-shrink x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-flex-shrink
        </div>
        <div class="x-flex-none x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-flex-none
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-self-stretch x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Self Align</h2>
      <div
        class="
          x-list x-list--horizontal x-list--gap-03
          x-self-stretch
          x-padding--02
          x-background--neutral-95
        "
        style="height: 100px"
      >
        <div class="x-self-auto x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-self-auto
        </div>
        <div class="x-self-start x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-self-start
        </div>
        <div class="x-self-end x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-self-end
        </div>
        <div class="x-self-center x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-self-center
        </div>
        <div class="x-self-stretch x-background--auxiliary x-padding--03 x-font-color--neutral-100">
          x-self-stretch
        </div>
        <div
          class="x-self-baseline x-background--auxiliary x-padding--03 x-font-color--neutral-100"
        >
          x-self-baseline
        </div>
      </div>
    </article>

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

    <article class="x-list x-list--wrap x-list--gap-06 x-list--align-center">
      <h2 class="x-title2">Font Size</h2>
      <div v-for="size in fontSizes" :key="size" class="x-list" :class="' x-font-size--' + size">
        Font Size {{ size }}
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Line Height</h2>
      <div class="x-list x-list--horizontal x-list--gap-06">
        <div class="x-list x-line-height--none">
          <span>Line Height None</span>
          <span>Line Height None</span>
          <span>Line Height None</span>
        </div>
        <div class="x-list x-line-height--tight">
          <span>Line Height Tight</span>
          <span>Line Height Tight</span>
          <span>Line Height Tight</span>
        </div>
        <div class="x-list x-line-height--snug">
          <span>Line Height Snug</span>
          <span>Line Height Snug</span>
          <span>Line Height Snug</span>
        </div>
        <div class="x-list x-line-height--normal">
          <span>Line Height None</span>
          <span>Line Height None</span>
          <span>Line Height None</span>
        </div>
        <div class="x-list x-line-height--relaxed">
          <span>Line Height Relaxed</span>
          <span>Line Height Relaxed</span>
          <span>Line Height Relaxed</span>
        </div>
        <div class="x-list x-line-height--loose">
          <span>Line Height Loose</span>
          <span>Line Height Loose</span>
          <span>Line Height Loose</span>
        </div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Text Decoration</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div class="x-padding--06 x-underline">Underline</div>
        <div class="x-padding--06 x-overline">Overline</div>
        <div class="x-padding--06 x-line-through">Line Through</div>
        <div class="x-padding--06 x-no-underline">No Underline</div>
      </div>
    </article>

    <article class="x-list x-list--vertical x-list--gap-06 x-padding-bottom--06">
      <h2 class="x-title2">Text Transform</h2>
      <div class="x-list x-list--wrap x-list--gap-06 x-list--align-start">
        <div class="x-padding--06 x-uppercase">Uppercase</div>
        <div class="x-padding--06 x-lowercase">Lowercase</div>
        <div class="x-padding--06 x-capitalize">Capitalize</div>
        <div class="x-padding--06 x-normal-case">Normal case</div>
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

    <article class="positions x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Position</h2>
      <div class="x-background--neutral-95 x-padding--03 x-absolute">Absolute</div>
      <div class="x-background--neutral-95 x-padding--03 x-static">Static</div>
      <div class="x-background--neutral-95 x-padding--03 x-fixed">Fixed</div>
      <div class="x-background--neutral-95 x-padding--03 x-relative">Relative</div>
      <div class="x-background--neutral-95 x-padding--03 x-sticky">Sticky</div>
    </article>

    <article class="positions x-list x-list--wrap x-list--gap-06 x-list--align-start">
      <h2 class="x-title2">Line Clamp</h2>
      <div v-for="lines in 5" :key="lines">
        <h1 class="x-title3">Line Clamp {{ ++lines }}</h1>
        <p class="x-background--neutral-95" :class="' x-line-clamp--' + lines">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas auctor ligula et
          tristique malesuada. Nullam fringilla orci quis euismod bibendum. Cras mattis volutpat
          rutrum. Ut laoreet sagittis lorem ac fermentum. Sed sagittis metus nulla, sit amet
          vestibulum nisl auctor eu. Donec lobortis sollicitudin commodo. Vivamus efficitur nibh vel
          elementum mollis. Mauris eget odio lectus. Suspendisse potenti. Proin ornare pharetra
          tempor. Cras sed neque eget odio lacinia sagittis. Cras a gravida velit. Ut porttitor,
          neque sed volutpat lacinia, nisi massa cursus neque, vitae dictum quam enim quis ligula.
          Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Nunc rhoncus ornare diam, ac venenatis sapien facilisis in. Integer vitae vulputate quam,
          in imperdiet tortor. Nam lacus purus, porttitor eu turpis a, finibus malesuada dolor. Ut
          massa lacus, sodales eget dictum sed, gravida sit amet lectus. Aliquam quis arcu dolor.
          Duis volutpat lacus ac dolor scelerisque ultricies. Fusce finibus leo ut auctor bibendum.
          Aliquam sed nisi dui. Fusce laoreet purus justo, vel eleifend tellus iaculis ac. Integer
          eget consequat ex. Quisque in dictum ipsum. Mauris sit amet nisl feugiat, mattis magna
          sed, vestibulum augue. Nunc non ante in nisi dictum luctus eu a nibh. Ut eleifend ipsum
          tellus, sit amet dapibus est auctor a. Integer ante est, rhoncus et risus volutpat,
          ultricies dictum urna. Duis sed cursus massa. Quisque ut tortor enim. Donec semper leo in
          venenatis rhoncus. Phasellus eget blandit metus. Aenean nisl urna, interdum eget hendrerit
          vitae, pellentesque at augue. Mauris condimentum tortor egestas, faucibus sem eu, rhoncus
          massa. Suspendisse viverra dolor vitae enim accumsan volutpat. Duis id dictum enim, vitae
          dapibus sapien. Phasellus interdum mi in lorem pretium hendrerit. Sed massa tellus,
          volutpat quis rhoncus in, tempus et nisl. Proin lacinia ullamcorper nisi eu aliquet.
        </p>
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
      'disable',
      'transparent'
    ];

    protected maxSize = 20;

    protected get sizes(): string[] {
      return Array.from({ length: this.maxSize + 1 }, (_, index) => String(index).padStart(2, '0'));
    }

    protected get borderSizes(): string[] {
      return this.sizes.slice(0, 11);
    }

    protected get fontSizes(): string[] {
      return this.sizes.slice(1, 11);
    }

    protected get shadowsSizes(): string[] {
      return this.sizes.slice(1, 11);
    }
  }
</script>

<style lang="scss" scoped>
  .x-background--neutral-10 {
    color: var(--x-color-base-neutral-100);
  }

  .x-font-color--neutral-100,
  .x-font-color--neutral-95 {
    background-color: var(--x-color-base-neutral-70);
  }

  .x-font-color--transparent {
    text-shadow: #888888 0px 0px;
  }

  .positions {
    .x-absolute,
    .x-static,
    .x-fixed,
    .x-relative,
    .x-sticky {
      position: static !important;
    }
  }
</style>
