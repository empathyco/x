<template>
  <div class="x-layout x-layout--single-column" :class="{ 'dev-mode': devMode }">
    <header v-if="hasContent('header')" class="x-layout__header x-list x-list--horizontal">
      <!-- @slot Slot that is used to insert content into the Header. -->
      <slot name="header">
        <span v-if="devMode" class="slot-helper">HEADER</span>
      </slot>
    </header>

    <div v-if="hasContent('sub-header')" class="x-layout__sub-header x-list x-list--horizontal">
      <!-- @slot Slot that can be used to insert content into the Sub Header. -->
      <slot name="sub-header">
        <span v-if="devMode" class="slot-helper">SUB HEADER</span>
      </slot>
    </div>

    <div v-if="hasContent('toolbar')" class="x-layout__toolbar x-list x-list--horizontal">
      <!-- @slot Slot that can be used to insert content into the Toolbar. -->
      <slot name="toolbar">
        <span v-if="devMode" class="slot-helper">TOOLBAR</span>
      </slot>
    </div>

    <div v-if="hasContent('predictive')" class="x-layout__predictive x-list x-list--vertical">
      <BaseScroll class="x-layout__predictive-scroll x-list x-list--vertical x-list__item--expand">
        <!-- @slot Slot that can be used to insert content into the Predictive Layer. -->
        <slot name="predictive">
          <span v-if="devMode" class="slot-helper">PREDICTIVE</span>
        </slot>
      </BaseScroll>
    </div>

    <main v-if="hasContent('main')" class="x-layout__main">
      <MainScroll>
        <Scroll id="main-scroll" class="x-layout__main-scroll x-list x-list--vertical">
          <!-- @slot Slot that can be used to insert content into the Main. -->
          <slot name="main">
            <span v-if="devMode" class="slot-helper">MAIN</span>
          </slot>
        </Scroll>
      </MainScroll>
    </main>

    <div v-if="hasContent('floating')" class="x-layout__floating x-list x-list--horizontal">
      <!-- @slot Slot that can be used to insert content into the Floating. -->
      <slot name="floating">
        <span v-if="devMode" class="slot-helper">FLOATING</span>
      </slot>
    </div>

    <footer v-if="hasContent('footer')" class="x-layout__footer x-list x-list--horizontal">
      <!-- @slot Slot that can be used to insert content into the Footer. -->
      <slot name="footer">
        <span v-if="devMode" class="slot-helper">FOOTER</span>
      </slot>
    </footer>

    <BaseIdModal
      v-if="hasContent('aside')"
      :animation="asideAnimation"
      modalId="aside-modal"
      class="x-layout__aside"
    >
      <!-- @slot Slot that can be used to insert content into the Aside. -->
      <slot name="aside">
        <span v-if="devMode" class="slot-helper">ASIDE</span>
      </slot>
    </BaseIdModal>

    <slot name="extra-aside">
      <span v-if="devMode" class="slot-helper">EXTRA ASIDE</span>
    </slot>
  </div>
</template>

<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import Vue, { defineComponent } from 'vue';
  import Scroll from '../../x-modules/scroll/components/scroll.vue';
  import MainScroll from '../../x-modules/scroll/components/main-scroll.vue';
  import { animateTranslate } from '../animations/animate-translate/animate-translate.factory';
  import BaseIdModal from '../modals/base-id-modal.vue';
  import BaseScroll from '../scroll/base-scroll.vue';
  import { AnimationProp } from '../../types';
  import { useLayouts } from './use-layouts';

  /**
   * Component for use as Layout to be filled with the rest of the Components.
   *
   * @deprecated - The layout has been deprecated in favor of using new XDS layout.
   *
   * @public
   */
  export default defineComponent({
    name: 'SingleColumnLayout',
    components: { BaseIdModal, BaseScroll, MainScroll, Scroll },
    props: {
      /**
       * The animation used for the Main Aside.
       *
       * @public
       */
      asideAnimation: {
        type: AnimationProp,
        default: () => animateTranslate('right')
      },
      /**
       * Enables the devMode, which shows the available slots to use with its names.
       *
       * @public
       */
      devMode: {
        type: Boolean,
        default: false
      }
    },
    setup: function (props, { slots }) {
      const { hasContent } = useLayouts(props.devMode, slots);

      return { hasContent };
    }
  });
</script>

<style scoped lang="scss">
  @import '../../design-system-deprecated/utilities/dev-mode';

  .x-layout {
    display: grid;
    align-content: stretch;
    justify-content: stretch;
    height: 100%;

    grid-template-rows:
      [page-start header-start]
      auto
      [header-end sub-header-start]
      auto
      [sub-header-end toolbar-start]
      auto
      [toolbar-end main-start]
      1fr
      [floating-start]
      auto
      [main-end floating-end footer-start]
      auto
      [footer-end page-end];

    grid-template-columns: 1fr;

    > * {
      grid-column: 1/-1;
      min-width: 0;
      min-height: 0;
      display: flex;
    }

    &__header {
      grid-row: header;
      z-index: 1;
    }

    &__sub-header {
      grid-row: sub-header;
      z-index: 1;
    }

    &__toolbar {
      grid-row: toolbar;
      z-index: 1;
    }

    &__predictive {
      grid-row-start: header-end;
      grid-row-end: page-end;
      flex-flow: column nowrap;
      z-index: 2;
    }

    &__main {
      grid-row: main;
      flex-flow: column nowrap;
    }

    &__floating {
      grid-row: floating;
      z-index: 1;
    }

    &__footer {
      grid-row: footer;
    }

    ::v-deep .x-layout__aside {
      grid-row: page;
      z-index: 3;

      .x-modal__content {
        width: 100%;
        height: 100%;
        margin-inline-start: var(--x-size-margin-left-layout-single-column, 0);
      }
    }

    &__predictive ::v-deep,
    &__floating ::v-deep,
    .slot-helper ::v-deep {
      pointer-events: none;

      > * {
        pointer-events: all;
      }

      > .x-list {
        pointer-events: none;

        > * {
          pointer-events: all;
        }
      }
    }
  }
</style>
