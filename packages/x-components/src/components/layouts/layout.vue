<template>
  <div
    class="x-layout"
    :class="{ 'dev-mode': devMode }"
    :style="{ height: renderConditions.mainBody ? '100%' : 'auto' }"
  >
    <header class="x-layout__header">
      <div v-if="renderConditions.headerStart" class="x-list x-layout__header-start">
        <!-- @slot Slot that is be used for insert content into the Header Left. -->
        <slot name="header-start">
          <span v-if="devMode" class="slot-helper">HEADER START</span>
        </slot>
      </div>

      <div v-if="renderConditions.headerMiddle" class="x-list x-layout__header-middle">
        <!-- @slot Slot that is be used for insert content into the Header Middle. -->
        <slot name="header-middle">
          <span v-if="devMode" class="slot-helper">HEADER MIDDLE</span>
        </slot>
      </div>

      <div v-if="renderConditions.headerEnd" class="x-list x-layout__header-end">
        <!-- @slot Slot that is be used for insert content into the Header Right. -->
        <slot name="header-end">
          <span v-if="devMode" class="slot-helper">HEADER END</span>
        </slot>
      </div>
    </header>

    <Empathize
      v-if="renderConditions.empathize"
      class="x-layout__empathize"
      :animation="empathizeAnimation"
    >
      <div class="x-list x-layout__empathize-content">
        <!-- @slot Slot that is be used for insert content into the Empathize. -->
        <slot name="empathize"><span v-if="devMode" class="slot-helper">EMPATHIZE</span></slot>
      </div>
    </Empathize>

    <section v-if="renderConditions.toolbar" class="x-layout__toolbar">
      <aside class="x-list x-layout__toolbar-aside">
        <slot name="toolbar-aside">
          <!-- @slot Slot that is be used for insert content into the Toolbar Aside. -->
          <span v-if="devMode" class="slot-helper">TOOLBAR ASIDE</span>
        </slot>
      </aside>

      <div class="x-list x-layout__toolbar-body">
        <!-- @slot Slot that is be used for insert content into the Toolbar Body. -->
        <slot name="toolbar-body">
          <span v-if="devMode" class="slot-helper">TOOLBAR BODY</span>
        </slot>
      </div>
    </section>

    <main class="x-layout__main">
      <BaseIdTogglePanel
        v-if="renderConditions.mainAside"
        panelId="aside-panel"
        :animation="asideAnimation"
        class="x-layout__collapse-aside"
      >
        <BaseIdScroll id="aside-scroll" class="x-layout__aside-scroll">
          <div class="x-layout__main-aside x-list x-list--vertical">
            <!-- @slot Slot that is be used for insert content into the Main Aside. -->
            <slot name="main-aside">
              <span v-if="devMode" class="slot-helper" style="height: 110vh">MAIN ASIDE</span>
            </slot>
          </div>
        </BaseIdScroll>
      </BaseIdTogglePanel>

      <BaseIdScroll v-if="renderConditions.mainBody" id="body-scroll" class="x-layout__body-scroll">
        <section class="x-layout__main-body x-list x-list--vertical">
          <!-- @slot Slot that is be used for insert content into the Main Body. -->
          <slot name="main-body">
            <span v-if="devMode" class="slot-helper" style="height: 110vh">MAIN BODY</span>
          </slot>
        </section>
      </BaseIdScroll>
    </main>
    <div class="x-layout__scroll-to-top">
      <slot name="scroll-to-top">
        <span v-if="devMode" class="slot-helper" style="height: 50px">SCROLL TO TOP</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component';
  import { Prop } from 'vue-property-decorator';
  import Vue, { VNode } from 'vue';
  import Empathize from '../../x-modules/empathize/components/empathize.vue';
  import CollapseFromTop from '../animations/collapse-from-top.vue';
  import BaseIdTogglePanel from '../panels/base-id-toggle-panel.vue';
  import BaseIdScroll from '../scroll/base-id-scroll.vue';
  import AnimateWidth from '../animations/animate-width.vue';

  /**
   * Component for use as Layout to be filled with the rest of the Components.
   *
   * @public
   */
  @Component({
    components: { Empathize, BaseIdTogglePanel, BaseIdScroll }
  })
  export default class Layout extends Vue {
    /**
     * Enables the devMode, which shows the available slots to use with its names.
     *
     * @public
     */
    @Prop({ default: false })
    protected devMode!: boolean;

    /**
     * The animation used for the Main Aside.
     *
     * @public
     */
    @Prop({ default: () => AnimateWidth })
    protected asideAnimation!: Vue;

    /**
     * The animation used for the Empathize.
     *
     * @public
     */
    @Prop({ default: () => CollapseFromTop })
    protected empathizeAnimation!: Vue;

    /**
     * Computed with the conditions to render each part of the layout.
     *
     * @returns Object with one key by layout section.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    protected get renderConditions(): {} {
      return {
        headerStart: this.devMode || this.hasContent(this.$slots['header-start']),
        headerMiddle: this.devMode || this.hasContent(this.$slots['header-middle']),
        headerEnd: this.devMode || this.hasContent(this.$slots['header-end']),
        empathize: this.devMode || this.hasContent(this.$slots.empathize),
        toolbar:
          this.devMode ||
          this.hasContent(this.$slots['toolbar-aside']) ||
          this.hasContent(this.$slots['toolbar-body']),
        mainAside: this.devMode || this.hasContent(this.$slots['main-aside']),
        mainBody: this.devMode || this.hasContent(this.$slots['main-body']),
        scrollToTop: this.devMode || this.hasContent(this.$slots['scroll-to-top'])
      };
    }

    /**
     * Function to check if an slot has rendered content or not.
     *
     * @param slot - A VNode Array with of each slot.
     * @returns True if the slot has rendered content or false otherwise.
     *
     * @internal
     */
    protected hasContent(slot: VNode[] | undefined): boolean {
      return slot?.some(vNode => vNode.tag !== undefined) ?? false;
    }
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
</style>
