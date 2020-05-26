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
  // eslint-disable-next-line max-len
  import { DirectionalFocusNavigationService } from '../../../services/directional-focus-navigation.service';
  import { SpatialNavigation } from '../../../services/services.types';
  import { ArrowKey } from '../../../utils';
  import { empathizeXModule } from '../x-module';
  import { XOn } from '../../../components/decorators';

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
    protected navigationService!: SpatialNavigation;

    mounted(): void {
      // TODO Replace this with injection
      this.navigationService = new DirectionalFocusNavigationService(this.$el as HTMLElement);
    }

    /**
     * Focus the next navigable element returned by the navigation service.
     *
     * @param direction - The direction.
     * @public
     */
    @XOn('UserPressedArrowKey')
    focusNextNavigableElement(direction: ArrowKey): void {
      this.navigationService?.navigateTo(direction)?.focus();
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
