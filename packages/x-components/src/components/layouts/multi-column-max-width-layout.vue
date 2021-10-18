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
  .dev-mode {
    .slot-helper {
      font-family: inherit;
      color: grey;
      box-sizing: border-box;
      display: flex;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      border: dashed 1px grey;
      border-radius: 10px;
    }
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

    // color
    background-color: var(--x-color-background-layout-columns, white);
    border-color: var(--x-color-border-layout-columns);

    // border
    border-style: solid;
    border-width: var(--x-size-border-width-layout-columns, 0);

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

    &__main-aside {
      // color
      background-color: var(--x-color-background-layout-columns-main-aside, transparent);
      border-color: var(--x-color-border-layout-columns-main-aside, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-main-aside, 0);
    }

    &__body-scroll {
      flex: 1 1 auto;
      width: 0;
      padding-right: calc(var(--x-size-margin-layout-columns) + var(--x-size-gap-default) - 16px);

      &.x-scroll {
        --x-string-overflow-scroll: scroll;
      }
    }

    &__main-body {
      // color
      background-color: var(--x-color-background-layout-columns-main-body, transparent);
      border-color: var(--x-color-border-layout-columns-main-body, transparent);

      // border
      border-style: solid;
      border-width: var(--x-size-border-width-layout-columns-main-body, 0);

      ::v-deep .x-grid {
        --x-size-gap-grid: var(--x-size-gap-default);
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
