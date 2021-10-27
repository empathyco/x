<template>
  <div
    class="x-layout x-layout--columns"
    :class="{ 'dev-mode': devMode }"
    :style="{ height: hasContent('main-body') ? '100%' : 'auto' }"
  >
    <header class="x-layout__header">
      <div v-if="hasContent('header-start')" class="x-list x-layout__header-start">
        <!-- @slot Slot that can be used to insert content into the left part of the header. -->
        <slot name="header-start">
          <span v-if="devMode" class="slot-helper">HEADER START</span>
        </slot>
      </div>

      <div v-if="hasContent('header-middle')" class="x-list x-layout__header-middle">
        <!-- @slot Slot that can be used to insert content into the center part of the header. -->
        <slot name="header-middle">
          <span v-if="devMode" class="slot-helper">HEADER MIDDLE</span>
        </slot>
      </div>

      <div v-if="hasContent('header-end')" class="x-list x-layout__header-end">
        <!-- @slot Slot that can be used to insert content into the right part of the header. -->
        <slot name="header-end">
          <span v-if="devMode" class="slot-helper">HEADER END</span>
        </slot>
      </div>
    </header>

    <div v-if="hasContent('sub-header')" class="x-layout__sub-header">
      <div class="x-layout__sub-header-content">
        <!-- @slot Slot that can be used to insert content into below the header. -->
        <slot name="sub-header">
          <span v-if="devMode" class="slot-helper">SUB HEADER</span>
        </slot>
      </div>
    </div>

    <section v-if="hasContent('toolbar-aside', 'toolbar-body')" class="x-layout__toolbar">
      <aside class="x-list x-layout__toolbar-aside">
        <slot name="toolbar-aside">
          <!-- @slot Slot that can be used to insert content above the left aside. -->
          <span v-if="devMode" class="slot-helper">TOOLBAR ASIDE</span>
        </slot>
      </aside>

      <div class="x-list x-layout__toolbar-body">
        <!-- @slot Slot that can be used to insert content above the body. -->
        <slot name="toolbar-body">
          <span v-if="devMode" class="slot-helper">TOOLBAR BODY</span>
        </slot>
      </div>
    </section>

    <main class="x-layout__main">
      <BaseIdTogglePanel
        v-if="hasContent('main-aside')"
        panelId="aside-panel"
        :animation="asideAnimation"
        class="x-layout__collapse-aside"
      >
        <BaseIdScroll id="aside-scroll" class="x-layout__aside-scroll">
          <div class="x-layout__main-aside x-list x-list--vertical">
            <!-- @slot Slot that can be used to insert content into the left side bar. -->
            <slot name="main-aside">
              <span v-if="devMode" class="slot-helper" style="height: 110vh">MAIN ASIDE</span>
            </slot>
          </div>
        </BaseIdScroll>
      </BaseIdTogglePanel>

      <BaseIdScroll v-if="hasContent('main-body')" id="main-scroll" class="x-layout__body-scroll">
        <section class="x-layout__main-body x-list x-list--vertical">
          <!-- @slot Slot that can be used to insert the body content. -->
          <slot name="main-body">
            <span v-if="devMode" class="slot-helper" style="height: 110vh">MAIN BODY</span>
          </slot>
        </section>
      </BaseIdScroll>
    </main>

    <div v-if="hasContent('scroll-to-top')" class="x-layout__scroll-to-top">
      <slot name="scroll-to-top">
        <span v-if="devMode" class="slot-helper" style="height: 50px">SCROLL TO TOP</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Component, { mixins } from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import Vue from 'vue';
  import BaseIdTogglePanel from '../panels/base-id-toggle-panel.vue';
  import BaseIdScroll from '../scroll/base-id-scroll.vue';
  import AnimateWidth from '../animations/animate-width.vue';
  import LayoutsMixin from './layouts.mixin';

  /**
   * Component for use as Layout to be filled with the rest of the Components.
   *
   * @public
   */
  @Component({
    components: { BaseIdTogglePanel, BaseIdScroll }
  })
  export default class MultiColumnMaxWidthLayout extends mixins(LayoutsMixin) {
    /**
     * The animation used for the Main Aside.
     *
     * @public
     */
    @Prop({ default: () => AnimateWidth })
    protected asideAnimation!: Vue;
  }
</script>

<style lang="scss" scoped>
  @import '../../design-system/utilities/dev-mode';

  :root {
    //layout
    --x-size-min-margin-layout-columns: var(--x-size-base-06);
    --x-size-column-gap-layout-columns: var(--x-size-base-06);

    //spacing

    // size - header
    --x-size-padding-top-layout-columns-header: var(--x-size-base-07);
    --x-size-padding-bottom-layout-columns-header: var(--x-size-base-05);

    // size - toolbar
    --x-size-padding-top-layout-columns-toolbar: var(--x-size-base-05);
    --x-size-padding-bottom-layout-columns-toolbar: var(--x-size-base-03);

    // size- scroll-to-top
    --x-size-margin-bottom-layout-columns-scroll-to-top: var(--x-size-base-03);
    --x-size-margin-left-layout-columns-scroll-to-top: var(--x-size-base-03);

    // color
    --x-color-background-layout-columns: var(--x-color-base-neutral-100);
    --x-color-border-layout-columns: var(--x-color-base-neutral-70);
    --x-color-border-layout-columns-header: var(--x-color-border-layout-columns);
    --x-color-border-layout-columns-sub-header: var(--x-color-border-layout-columns);
    --x-color-border-layout-columns-toolbar: var(--x-color-border-layout-columns);
    --x-color-border-layout-columns-main: var(--x-color-border-layout-columns);
    --x-color-border-layout-columns-main-aside: var(--x-color-border-layout-columns);
    --x-color-border-layout-columns-main-body: var(--x-color-border-layout-columns);

    // border
    --x-size-border-width-layout-columns-header: 0;
    --x-size-border-width-layout-columns-toolbar: 1px 0 0;
  }

  .x-layout {
    // custom properties
    --x-size-gap-default: var(--x-size-column-gap-layout-columns, 20px);
    --x-size-margin-max-width: calc((100vw - var(--x-size-max-width-layout-columns, 1440px)) / 2);
    --x-size-margin-layout-columns: max(
      var(--x-size-min-margin-layout-columns, 20px),
      var(--x-size-margin-max-width)
    );
    --x-number-columns-header-middle: calc(var(--x-number-columns-layout-columns, 5) - 2);
    --x-number-columns-sub-header-content: var(--x-number-columns-header-middle);
    --x-number-columns-toolbar-body: calc(var(--x-number-columns-layout-columns, 5) - 1);

    // layout
    display: grid;
    align-content: stretch;
    max-height: 100%;

    grid-template-columns:
      [page-start]
      1fr
      [scroll-to-top-start]
      calc(var(--x-size-margin-layout-columns) + var(--x-size-gap-default))
      [scroll-to-top-end page-end];

    grid-template-rows:
      [page-start header-start]
      auto
      [header-end sub-header-start]
      auto
      [sub-header-end toolbar-start]
      auto
      [toolbar-end main-start]
      1fr
      [scroll-to-top-start]
      auto
      [main-end scroll-to-top-end page-end];

    &__header {
      // layout
      grid-column: page;
      grid-row: header;
      display: grid;
      column-gap: var(--x-size-gap-default);

      grid-template-columns:
        [header-start]
        var(--x-size-margin-layout-columns)
        [start-content-start]
        1fr
        [start-content-end middle-content-start]
        repeat(var(--x-number-columns-header-middle), 1fr)
        [middle-content-end end-content-start]
        1fr
        [end-content-end]
        var(--x-size-margin-layout-columns)
        [header-end];

      // size
      padding-block-start: var(--x-size-padding-top-layout-columns-header, 0);
      padding-block-end: var(--x-size-padding-bottom-layout-columns-header, 0);
      margin-block-start: var(--x-size-margin-top-layout-columns-header, 0);
      margin-block-end: var(--x-size-margin-bottom-layout-columns-header, 0);

      // color
      background-color: var(--x-color-background-layout-columns-header, transparent);
      border-color: var(--x-color-border-layout-columns-header, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-header, 0);
    }

    &__header-start {
      // layout
      grid-column: start-content;

      &.x-list {
        // space
        flex-flow: var(--x-flow-layout-columns-header-start, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-header-start, flex start);
        align-items: var(--x-size-align-layout-columns-header-start, flex start);
      }
    }

    &__header-middle {
      // layout
      grid-column: middle-content;

      &.x-list {
        // space
        flex-flow: var(--x-flow-layout-columns-header-middle, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-header-middle, center);
        align-items: var(--x-size-align-layout-columns-header-middle, flex start);
      }
    }

    &__header-end {
      // layout
      grid-column: end-content;

      &.x-list {
        flex-flow: var(--x-flow-layout-columns-header-end, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-header-end, flex-end);
        align-items: var(--x-size-align-layout-columns-header-end, flex-start);
      }
    }

    &__sub-header {
      // layout
      grid-column: page;
      grid-row: sub-header;
      display: grid;
      column-gap: var(--x-size-gap-default);

      grid-template-columns:
        [sub-header-start]
        var(--x-size-margin-layout-columns)
        1fr
        [sub-header-content-start]
        repeat(var(--x-number-columns-sub-header-content), 1fr)
        [sub-header-content-end]
        1fr
        var(--x-size-margin-layout-columns)
        [sub-header-end];

      // size
      padding-block-start: var(--x-size-padding-top-layout-columns-sub-header, 0);
      padding-block-end: var(--x-size-padding-bottom-layout-columns-sub-header), 0;
      margin-block-start: var(--x-size-margin-top-layout-columns-sub-header, 0);
      margin-block-end: var(--x-size-margin-bottom-layout-columns-sub-header, 0);

      // color
      background-color: var(--x-color-background-layout-columns-sub-header, transparent);
      border-color: var(--x-color-border-layout-columns-sub-header, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-sub-header, 0);
    }

    &__sub-header-content {
      // layout
      grid-column: sub-header-content;

      &.x-list {
        flex-flow: var(--x-flow-layout-columns-sub-header, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-sub-header, flex-start);
        align-items: var(--x-size-align-layout-columns-sub-header, flex-start);
      }
    }

    &__toolbar {
      // layout
      grid-column: page;
      grid-row: toolbar;
      display: grid;
      column-gap: var(--x-size-gap-default);

      grid-template-columns:
        [toolbar-start]
        var(--x-size-margin-layout-columns)
        [toolbar-aside-start]
        1fr
        [toolbar-aside-end toolbar-body-start]
        repeat(var(--x-number-columns-toolbar-body), 1fr)
        [toolbar-body-end]
        var(--x-size-margin-layout-columns)
        [toolbar-end];

      // size
      padding-block-start: var(--x-size-padding-top-layout-columns-toolbar, 0);
      padding-block-end: var(--x-size-padding-bottom-layout-columns-toolbar, 0);
      margin-block-start: var(--x-size-margin-top-layout-columns-toolbar, 0);
      margin-block-end: var(--x-size-margin-bottom-layout-columns-toolbar, 0);

      // color
      background-color: var(--x-color-background-layout-columns-toolbar, transparent);
      border-color: var(--x-color-border-layout-columns-toolbar, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-toolbar, 0);
    }

    &__toolbar-aside {
      // layout
      grid-column: toolbar-aside;

      &.x-list {
        flex-flow: var(--x-flow-layout-columns-toolbar-aside, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-toolbar-aside, flex-start);
        align-items: var(--x-size-align-layout-columns-toolbar-aside, center);
      }
    }

    &__toolbar-body {
      // layout
      grid-column: toolbar-body;

      &.x-list {
        flex-flow: var(--x-flow-layout-columns-toolbar-body, row nowrap);
        justify-content: var(--x-size-justify-layout-columns-toolbar-body, flex-end);
        align-items: var(--x-size-align-layout-columns-toolbar-body, center);
      }
    }

    &__main {
      // layout
      grid-column: page;
      grid-row: main;
      min-height: 0;
      display: flex;
      flex-flow: row nowrap;
      justify-content: stretch;
      padding-left: calc(var(--x-size-margin-layout-columns) + var(--x-size-gap-default));

      // size
      padding-block-start: var(--x-size-padding-top-layout-columns-main, 0);
      padding-block-end: var(--x-size-padding-bottom-layout-columns-main, 0);
      margin-block-start: var(--x-size-margin-top-layout-columns-main, 0);
      margin-block-end: var(--x-size-margin-bottom-layout-columns-main, 0);

      // color
      background-color: var(--x-color-background-layout-columns-main, transparent);
      border-color: var(--x-color-border-layout-columns-main, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-main, 0);
    }

    &__collapse-aside {
      width: calc(
        (
            100% - var(--x-size-gap-default) * (var(--x-number-columns-layout-columns, 5)) -
              var(--x-size-margin-layout-columns)
          ) / var(--x-number-columns-layout-columns, 5) + var(--x-size-gap-default)
      );
    }

    &__aside-scroll {
      height: 100%;
      margin-right: var(--x-size-gap-default);
    }

    &__body-scroll {
      flex: 1 1 auto;
      width: 0;
      padding-right: calc(var(--x-size-margin-layout-columns) + var(--x-size-gap-default) - 16px);

      &.x-scroll {
        --x-string-overflow-scroll: scroll;
      }
    }

    &__scroll-to-top {
      //layout
      grid-area: scroll-to-top;
      margin-block-end: var(--x-size-margin-bottom-layout-columns-scroll-to-top, 10px);
      margin-inline-start: var(--x-size-margin-left-layout-columns-scroll-to-top, 10px);
      z-index: 1;
    }
  }
</style>

<docs lang="mdx">
# Layout

This component has the following layout with fixed headers and collapsible fixed asides:

| header-start  | header-middle |  header-end   |
| :-----------: | :-----------: | :-----------: |
|  sub-header   |               |               |
| toolbar-aside |    toolbar    |               |
|  main-aside   |     main      |               |
|               |               | scroll-to-top |

# Design Tokens

The component has also the following `Design Tokens` to configure it:

|                        token                        | default value |
| :-------------------------------------------------: | :-----------: |
|         --x-size-column-gap-layout-columns          |     20px      |
|     --x-size-padding-top-layout-columns-header      |      0px      |
|    --x-size-padding-bottom-layout-columns-header    |      0px      |
|      --x-size-margin-top-layout-columns-header      |      0px      |
|    --x-size-margin-bottom-layout-columns-header     |      0px      |
|     --x-color-background-layout-columns-header      |  transparent  |
|       --x-color-border-layout-columns-header        |  transparent  |
|     --x-size-border-width-layout-columns-header     |      0px      |
|        --x-flow-layout-columns-header-start         |  row nowrap   |
|    --x-size-justify-layout-columns-header-start     |  flex-start   |
|     --x-size-align-layout-columns-header-start      |  flex-start   |
|        --x-flow-layout-columns-header-middle        |  row nowrap   |
|    --x-size-justify-layout-columns-header-middle    |    center     |
|     --x-size-align-layout-columns-header-middle     |  flex-start   |
|         --x-flow-layout-columns-header-end          |  row nowrap   |
|     --x-size-justify-layout-columns-header-end      |   flex-end    |
|      --x-size-align-layout-columns-header-end       |   flex-end    |
|   --x-size-padding-top-layout-columns-sub-header    |      0px      |
|  --x-size-padding-bottom-layout-columns-sub-header  |      0px      |
|    --x-size-margin-top-layout-columns-sub-header    |      0px      |
|  --x-size-margin-bottom-layout-columns-sub-header   |      0px      |
|   --x-color-background-layout-columns-sub-header    |  transparent  |
|     --x-color-border-layout-columns-sub-header      |  transparent  |
|   --x-size-border-width-layout-columns-sub-header   |      0px      |
|         --x-flow-layout-columns-sub-header          |  row nowrap   |
|     --x-size-justify-layout-columns-sub-header      |  flex-start   |
|      --x-size-align-layout-columns-sub-header       |  flex-start   |
|     --x-size-padding-top-layout-columns-toolbar     |      0px      |
|   --x-size-padding-bottom-layout-columns-toolbar    |      0px      |
|     --x-size-margin-top-layout-columns-toolbar      |      0px      |
|    --x-size-margin-bottom-layout-columns-toolbar    |      0px      |
|     --x-color-background-layout-columns-toolbar     |  transparent  |
|     --x-color-border-layout-columns-sub-toolbar     |  transparent  |
|    --x-size-border-width-layout-columns-toolbar     |      0px      |
|        --x-flow-layout-columns-toolbar-aside        |  row nowrap   |
|    --x-size-justify-layout-columns-toolbar-aside    |  flex-start   |
|     --x-size-align-layout-columns-toolbar-aside     |    center     |
|        --x-flow-layout-columns-toolbar-body         |  row nowrap   |
|    --x-size-justify-layout-columns-toolbar-body     |  flex-start   |
|     --x-size-align-layout-columns-toolbar-body      |    center     |
|      --x-size-padding-top-layout-columns-main       |      0px      |
|     --x-size-padding-bottom-layout-columns-main     |      0px      |
|       --x-size-margin-top-layout-columns-main       |      0px      |
|     --x-size-margin-bottom-layout-columns-main      |      0px      |
|      --x-color-background-layout-columns-main       |  transparent  |
|      --x-color-border-layout-columns-sub-main       |  transparent  |
|      --x-size-border-width-layout-columns-main      |      0px      |
|   --x-color-background-layout-columns-main-aside    |  transparent  |
|   --x-color-border-layout-columns-sub-main-aside    |  transparent  |
|   --x-size-border-width-layout-columns-main-aside   |      0px      |
|    --x-color-background-layout-columns-main-body    |  transparent  |
|    --x-color-border-layout-columns-sub-main-body    |  transparent  |
|   --x-size-border-width-layout-columns-main-body    |      0px      |
| --x-size-margin-bottom-layout-columns-scroll-to-top |     10px      |
|  --x-size-margin-left-layout-columns-scroll-to-top  |     10px      |

|                        token                        |                   use                    |
| :-------------------------------------------------: | :--------------------------------------: |
|         --x-size-column-gap-layout-columns          |         The gap between columns          |
|     --x-size-padding-top-layout-columns-header      |      The padding top of the header       |
|    --x-size-padding-bottom-layout-columns-header    |     The padding bottom of the header     |
|      --x-size-margin-top-layout-columns-header      |       The margin top of the header       |
|    --x-size-margin-bottom-layout-columns-header     |     The margin bottom of the header      |
|     --x-color-background-layout-columns-header      |    The background color of the header    |
|       --x-color-border-layout-columns-header        |      The border color of the header      |
|     --x-size-border-width-layout-columns-header     |      The border width of the header      |
|        --x-flow-layout-columns-header-start         |    The flex flow of the start header     |
|    --x-size-justify-layout-columns-header-start     | The justify content of the start header  |
|     --x-size-align-layout-columns-header-start      |   The align items of the start header    |
|        --x-flow-layout-columns-header-middle        |    The flex flow of the middle header    |
|    --x-size-justify-layout-columns-header-middle    | The justify content of the middle header |
|     --x-size-align-layout-columns-header-middle     |   The align items of the middle header   |
|         --x-flow-layout-columns-header-end          |     The flex flow of the end header      |
|     --x-size-justify-layout-columns-header-end      |  The justify content of the end header   |
|      --x-size-align-layout-columns-header-end       |    The align items of the end header     |
|   --x-size-padding-top-layout-columns-sub-header    |   The padding bottom of the sub header   |
|  --x-size-padding-bottom-layout-columns-sub-header  |    The padding top of the sub header     |
|    --x-size-margin-top-layout-columns-sub-header    |   The margin bottom of the sub header    |
|  --x-size-margin-bottom-layout-columns-sub-header   |     The margin top of the sub header     |
|   --x-color-background-layout-columns-sub-header    |  The background color of the sub header  |
|     --x-color-border-layout-columns-sub-header      |    The border color of the sub header    |
|   --x-size-border-width-layout-columns-sub-header   |    The border width of the sub header    |
|         --x-flow-layout-columns-sub-header          |     The flex flow of the sub header      |
|     --x-size-justify-layout-columns-sub-header      |  The justify content of the sub header   |
|      --x-size-align-layout-columns-sub-header       |    The align items of the sub header     |
|     --x-size-padding-top-layout-columns-toolbar     |      The padding top of the toolbar      |
|   --x-size-padding-bottom-layout-columns-toolbar    |    The padding bottom of the toolbar     |
|     --x-size-margin-top-layout-columns-toolbar      |      The margin top of the toolbar       |
|    --x-size-margin-bottom-layout-columns-toolbar    |     The margin bottom of the toolbar     |
|     --x-color-background-layout-columns-toolbar     |   The background color of the toolbar    |
|     --x-color-border-layout-columns-sub-toolbar     |     The border color of the toolbar      |
|    --x-size-border-width-layout-columns-toolbar     |     The border width of the toolbar      |
|        --x-flow-layout-columns-toolbar-aside        |    The flex flow of the toolbar aside    |
|    --x-size-justify-layout-columns-toolbar-aside    | The justify content of the toolbar aside |
|     --x-size-align-layout-columns-toolbar-aside     |   The align items of the toolbar aside   |
|        --x-flow-layout-columns-toolbar-body         |  The flex flow of the end toolbar body   |
|    --x-size-justify-layout-columns-toolbar-body     | Justify content of the end toolbar body  |
|     --x-size-align-layout-columns-toolbar-body      |   The align items of the toolbar body    |
|      --x-size-padding-top-layout-columns-main       |       The padding top of the main        |
|     --x-size-padding-bottom-layout-columns-main     |      The padding bottom of the main      |
|       --x-size-margin-top-layout-columns-main       |        The margin top of the main        |
|     --x-size-margin-bottom-layout-columns-main      |      The margin bottom of the main       |
|      --x-color-background-layout-columns-main       |     The background color of the main     |
|        --x-color-border-layout-columns-main         |       The border color of the main       |
|      --x-size-border-width-layout-columns-main      |       The border width of the main       |
|   --x-color-background-layout-columns-main-aside    |  The background color of the main aside  |
|     --x-color-border-layout-columns-main-aside      |    The border color of the main aside    |
|   --x-size-border-width-layout-columns-main-aside   |  The border width of the sub main aside  |
|    --x-color-background-layout-columns-main-body    |  The background color of the main body   |
|      --x-color-border-layout-columns-main-body      |    The border color of the main body     |
|   --x-size-border-width-layout-columns-main-body    |  The border width of the sub main body   |
| --x-size-margin-bottom-layout-columns-scroll-to-top |  The margin bottom of the scroll to top  |
|  --x-size-margin-left-layout-columns-scroll-to-top  |   The margin left of the scroll to top   |
</docs>
