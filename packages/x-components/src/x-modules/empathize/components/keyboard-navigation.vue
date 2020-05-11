<template>
  <div
    @keydown.up.down.right.left="emitUserPressedArrowKey"
    class="x-empathize-keyboard-navigation"
    data-test="keyboard-navigation"
  >
    <!-- @slot (Required) to add content to the empathize container -->
    <slot />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { ArrowKey } from '../../../utils';
  import { WirePayload } from '../../../wiring';
  import { empathizeXModule } from '../x-module';

  /**
   * Container for empathize components which deals with the keyboard actions.
   *
   * @remarks
   * Subscribes to UserPressedArrowKey event emitted from components not inside this component.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(empathizeXModule)]
  })

  export default class KeyboardNavigation extends Vue {

    mounted(): void {
      // TODO Change this implementation to XOn after the task EX-1874
      const subscription = this.$x.on('UserPressedArrowKey', true)
        .subscribe(this.setFocusOnFirstFocusableChild.bind(this));
      this.$on('hook:beforeDestroy', () => subscription.unsubscribe());
    }

    /**
     * Set the focus on the first focusable child of the component.
     *
     * @param event - Event received from external module.
     *
     * @public
     */
    setFocusOnFirstFocusableChild(event: WirePayload<ArrowKey>): void {
      if (event.metadata.moduleName !== empathizeXModule.name) {
        const focusableElements = this.getKeyboardFocusableElements(this.$el);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }

    /**
     * Emit the {@link XEventsTypes.UserPressedArrowKey} when an arrow key it's pressed being this
     * component on focus or any of its children.
     *
     * @param event - Keyboard event.
     *
     * @public
     */
    emitUserPressedArrowKey({ key, target }: { key: ArrowKey; target: HTMLElement}): void {
      this.$x.emit('UserPressedArrowKey', key, { target });
    }

    /**
     * Gets keyboard-focusable elements within a specified element.
     *
     * @param element - To get focusable elements inside it.
     * @returns The NodeList of focusable elements.
     *
     * @internal
     */
    getKeyboardFocusableElements(element: Element): NodeListOf<HTMLElement> {
      return element.querySelectorAll(
        'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
      );
    }
  }
</script>

<docs>
  #Example

  This component has a slot to inject other components inside it. The component captures the an
  arrow key press  and emits `UserPressedArrowKey` event. The component also subscribes to
  `UserPressedArrowKey` event triggered by other components and set focus on its first focusable
  child.

  ## Basic Usage

  ```vue
  <KeyboardNavigation>
    <QuerySuggestions />
  </KeyboardNavigation>
  ```
</docs>
