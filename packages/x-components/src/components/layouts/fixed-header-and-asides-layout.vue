<template>
  <MainScroll>
    <Scroll
      @scroll="setPosition"
      id="main-scroll"
      class="x-layout x-layout--fixed-header-and-asides"
      :class="{ 'dev-mode': devMode }"
    >
      <div
        key="header-backdrop"
        class="x-layout__header-backdrop"
        :class="{ 'x-layout__header-backdrop--is-visible': isBackdropVisible }"
      />

      <header
        v-if="hasContent('header')"
        key="header"
        class="x-layout__header x-list x-list--horizontal"
      >
        <!-- @slot Slot that is be used for insert content into the Header. -->
        <slot name="header">
          <span v-if="devMode" class="slot-helper">HEADER</span>
        </slot>
      </header>

      <div v-if="hasContent('sub-header')" key="sub-header" class="x-layout__sub-header">
        <div class="x-layout__sub-header-content">
          <!-- @slot Slot that can be used to insert content into below the header. -->
          <slot name="sub-header">
            <span v-if="devMode" class="slot-helper">SUB HEADER</span>
          </slot>
        </div>
      </div>

      <section v-if="hasContent('toolbar')" key="toolbar" class="x-layout__toolbar">
        <slot name="toolbar">
          <!-- @slot Slot that can be used to insert content above the main. -->
          <span v-if="devMode" class="slot-helper">TOOLBAR</span>
        </slot>
      </section>

      <main v-if="hasContent('main')" key="main" class="x-layout__main x-list x-list--vertical">
        <!-- @slot Slot that is be used for insert content into the Main. -->
        <slot name="main">
          <span v-if="devMode" class="slot-helper">MAIN</span>
        </slot>
      </main>

      <BaseIdModal
        v-if="hasContent('left-aside')"
        key="left-aside"
        :animation="leftAsideAnimation"
        modalId="left-aside"
        class="x-layout__aside x-layout__aside--left"
      >
        <!-- @slot Slot that is be used for insert content into the left aside. -->
        <slot name="left-aside">
          <span v-if="devMode" class="slot-helper">LEFT ASIDE</span>
        </slot>
      </BaseIdModal>

      <BaseIdModal
        v-if="hasContent('right-aside')"
        key="right-aside"
        :animation="rightAsideAnimation"
        modalId="right-aside"
        class="x-layout__aside x-layout__aside--right"
      >
        <!-- @slot Slot that is be used for insert content into the right aside. -->
        <slot name="right-aside">
          <span v-if="devMode" class="slot-helper">RIGHT ASIDE</span>
        </slot>
      </BaseIdModal>

      <slot name="extra-aside">
        <span v-if="devMode" class="slot-helper">EXTRA ASIDE</span>
      </slot>

      <div v-if="hasContent('scroll-to-top')" key="scroll-to-top" class="x-layout__scroll-to-top">
        <slot name="scroll-to-top">
          <span v-if="devMode" class="slot-helper">SCROLL TO TOP</span>
        </slot>
      </div>
    </Scroll>
  </MainScroll>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { mixins } from 'vue-class-component';
  import MainScroll from '../../x-modules/scroll/components/main-scroll.vue';
  import { animateTranslate } from '../animations/animate-translate/animate-translate.factory';
  import BaseIdModal from '../modals/base-id-modal.vue';
  import Scroll from '../../x-modules/scroll/components/scroll.vue';
  import LayoutsMixin from './layouts.mixin';

  /**
   * Component for use as Layout to be filled with the rest of the components.
   *
   * @public
   */
  @Component({
    components: {
      BaseIdModal,
      MainScroll,
      Scroll
    }
  })
  export default class FixedHeaderAndAsidesLayout extends mixins(LayoutsMixin) {
    protected scrollPosition = 0;
    protected rightAsideAnimation = animateTranslate('right');
    protected leftAsideAnimation = animateTranslate('left');

    protected setPosition(position: number): void {
      this.scrollPosition = position;
    }

    protected get isBackdropVisible(): boolean {
      return this.scrollPosition > 0;
    }
  }
</script>

<style scoped lang="scss">
  @import '../../design-system/utilities/dev-mode';

  .x-layout {
    // custom properties
    display: grid;
    align-content: stretch;
    min-height: 100%;

    // layout
    max-height: 100%;
    --x-size-margin-max-width: calc((100vw - var(--x-size-max-width-layout, 1440px)) / 2);
    --x-size-margin-layout: max(
      var(--x-size-min-margin-layout, 20px),
      var(--x-size-margin-max-width)
    );

    grid-template-rows:
      [page-start header-start]
      auto
      [header-end sub-header-start]
      auto
      [sub-header-end toolbar-start]
      auto
      [toolbar-end main-start]
      1fr
      [main-end page-end];

    grid-template-columns:
      [page-start]
      var(--x-size-margin-layout)
      [max-width-start]
      1fr
      [max-width-end]
      var(--x-size-margin-layout)
      [page-end];

    &__header {
      // layout
      position: sticky;
      top: -0.5px;
      z-index: 2;
      grid-row: header;
      grid-column: page;
      max-height: var(--x-size-max-height-layout-header, auto);
      padding: 0 var(--x-size-margin-layout);

      //color
      background: var(--x-color-background-layout-header, transparent);
      border-color: var(--x-size-border-color-layout-header, transparent);

      // border
      border-width: var(--x-size-border-width-layout-header, 0);
      border-style: solid;
    }

    &__sub-header {
      // layout
      grid-row: sub-header;
      grid-column: page;
      padding: 0 var(--x-size-margin-layout);

      //color
      background: var(--x-color-background-layout-sub-header, transparent);
      border-color: var(--x-size-border-color-layout-sub-header, transparent);

      // border
      border-width: var(--x-size-border-width-layout-sub-header, 0);
      border-style: solid;
    }

    &__toolbar {
      // layout
      grid-row: toolbar;
      grid-column: max-width;
    }

    &__main {
      // layout
      grid-row: main;
      grid-column: max-width;
    }

    ::v-deep .x-layout__aside {
      &.x-modal {
        // layout
        z-index: 3;
        flex-flow: row nowrap;
      }

      // others
      pointer-events: none;
      > *:not(.slot-helper) {
        pointer-events: all;
      }

      &--right.x-modal {
        justify-content: flex-end;
      }
    }

    &__scroll-to-top {
      position: fixed;
      z-index: 1;
      bottom: var(--x-size-margin-bottom-layout-scroll-to-top, 16px);
      right: var(--x-size-margin-right-layout-scroll-to-top, 16px);
    }

    &__header-backdrop {
      // layout
      grid-row: page;
      grid-column: page;
      position: sticky;
      top: -0.5px;
      z-index: 1;
      height: var(--x-size-height-layout-backdrop, 40vh);
      width: 100%;
      pointer-events: none;

      // color
      background-color: var(
        --x-color-background-layout-header-backdrop,
        var(--x-color-base-neutral-100, white)
      );
      mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));

      // transition
      opacity: 0;
      transition: opacity 0.2s ease-out;

      &--is-visible {
        opacity: 1;
      }
    }
  }

  ::v-deep .x-layout__aside {
    .x-modal__content {
      background-color: transparent;
      height: 100%;
      width: var(--x-size-width-layout-aside, 300px);
    }
  }
</style>

<docs lang="mdx">
## Layout

This component has the following layout with fixed headers and collapsible fixed asides:

|            |   header   |               |
| :--------: | :--------: | :-----------: |
| left-aside | sub-header |  right-aside  |
|            |  toolbar   |               |
|            |    main    |               |
|            |            | scroll-to-top |

Additionally it provides an empty slot `extra-aside` to be customized by the user.

## Design Tokens

The component has also the following `Design Tokens` to configure it:

|                    token                    | default value |
| :-----------------------------------------: | :-----------: |
|       --x-size-height-layout-backdrop       |     40vh      |
|         --x-size-width-layout-aside         |     300px     |
|         --x-size-min-margin-layout          |     20px      |
|      --x-size-max-height-layout-header      |     auto      |
|          --x-size-max-width-layout          |    1440px     |
| --x-color-background-layout-header-backdrop |     white     |
|     --x-color-background-layout-header      |  transparent  |
|     --x-size-border-color-layout-header     |  transparent  |
|     --x-size-border-width-layout-header     |      0px      |
|   --x-color-background-layout-sub-header    |  transparent  |
|   --x-size-border-color-layout-sub-header   |  transparent  |
|   --x-size-border-width-layout-sub-header   |      0px      |

|                    token                    |                    use                    |
| :-----------------------------------------: | :---------------------------------------: |
|       --x-size-height-layout-backdrop       |  The height for header gradient backdrop  |
|         --x-size-width-layout-aside         |          The width of the asides          |
|         --x-size-min-margin-layout          | The min horizontal margin for the Layout  |
|      --x-size-max-height-layout-header      |   The max height for the Layout Header    |
|          --x-size-max-width-layout          |       The max width for the Layout        |
| --x-color-background-layout-header-backdrop | The background color of the head backdrop |
|     --x-color-background-layout-header      |    The background color of the header     |
|     --x-size-border-color-layout-header     |      The border color of the header       |
|     --x-size-border-width-layout-header     |       The border with of the header       |
|   --x-color-background-layout-sub-header    |  The background color of the sub header   |
|   --x-size-border-color-layout-sub-header   |    The border color of the sub header     |
|   --x-size-border-width-layout-sub-header   |     The border with of the sub header     |
</docs>
