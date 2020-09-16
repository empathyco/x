<template>
  <div
    @keydown.up.down.right.left.prevent="focusNextNavigableElement"
    class="x-keyboard-navigation"
    data-test="keyboard-navigation"
  >
    <!-- @slot (Required) Container content -->
    <slot />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  // eslint-disable-next-line max-len
  import { DirectionalFocusNavigationService } from '../services/directional-focus-navigation.service';
  import { SpatialNavigation } from '../services/services.types';
  import {
    ArrowKey,
    EventsForDirectionLimit,
    TakeNavigationControl
  } from '../utils/types';
  import { XEventsOf } from '../wiring/events.types';
  import { WireMetadata } from '../wiring/wiring.types';
  import { XOn } from './decorators';

  /**
   * Base component to handle keyboard navigation for elements inside it. It has a required slot to
   * include the navigable elements.
   *
   * @remarks
   * The component can be customized through props: an array of navigationHijacker objects, which
   * contains: the xEvent to listen to, the moduleName in charge of emitting the event and to which
   * direction it should react to; to take control of the navigation and eventsForDirectionLimit, to
   * emit an xEvent when reaching the navigation limit in any direction.
   *
   * @public
   */
  @Component
  export default class BaseKeyboardNavigation extends Vue {
    /**
     * An array of {@link TakeNavigationControl | navigation hijacker} objects defining when to
     * take control of the keyboard navigation.
     */
    @Prop({
      default: () => [
        { xEvent: 'UserPressedArrowKey', moduleName: 'searchBox', direction: 'ArrowDown' }
      ]
    })
    protected navigationHijacker!: TakeNavigationControl[];

    /**
     * An {@link EventsForDirectionLimit} to emit when the user is already at the furthest element
     * in a direction and tries to keep going on the same direction.
     */
    @Prop({ default: () => ({ ArrowUp: 'UserReachedEmpathizeTop' })})
    protected eventsForDirectionLimit!: Partial<EventsForDirectionLimit>;

    /**
     * The {@link SpatialNavigation | navigation service} to use.
     */
    protected navigationService!: SpatialNavigation;

    /**
     * The element to focus.
     */
    protected elementToFocus: HTMLElement | undefined;

    mounted(): void {
      // TODO Replace this with injection
      this.navigationService = new DirectionalFocusNavigationService(this.$el as HTMLElement);
    }

    /**
     * Get the navigation hijacker events.
     *
     * @remarks
     * If the same {@link XEvent} is defined multiple times it is only inserted once.
     *
     * @returns The events to hijack the navigation.
     */
    protected get navigationHijackerEvents(): XEventsOf<ArrowKey>[] {
      const eventsSet = this.navigationHijacker.map(({ xEvent }) => xEvent);
      return Array.from(new Set(eventsSet));
    }

    /**
     * Trigger navigation if this component is in control of it.
     *
     * @param eventPayload - The {@link WirePayload.eventPayload}.
     * @param metadata - The {@link WirePayload.metadata}.
     * @public
     */
    @XOn(component => (component as BaseKeyboardNavigation).navigationHijackerEvents)
    triggerNavigation(eventPayload: ArrowKey, metadata: WireMetadata): void {
      if (this.hasToTakeNavigationControl(eventPayload, metadata)) {
        this.focusNextNavigableElement(eventPayload);
      }
    }

    /**
     * Checks if the component has to take control of the keyboard navigation.
     *
     * @param eventPayload - The {@link ArrowKey}.
     * @param metadata - The {@link WireMetadata}.
     *
     * @returns Whether the component needs to take control of the keyboard navigation or not.
     * @internal
     */
    private hasToTakeNavigationControl(eventPayload: ArrowKey, metadata: WireMetadata): boolean {
      return this.navigationHijacker.some(({ moduleName, direction }) =>
        moduleName === metadata.moduleName && direction === eventPayload
      );
    }

    /**
     * Focus the next navigable element returned by the navigation service.
     *
     * @param direction - The navigation direction.
     * @internal
     */
    protected focusNextNavigableElement(direction: ArrowKey | KeyboardEvent): void {
      const dir = typeof direction === 'object' ? (direction.key) as ArrowKey : direction;
      const nextElementToFocus = this.navigationService?.navigateTo(dir);

      if (this.elementToFocus !== nextElementToFocus) {
        this.elementToFocus = nextElementToFocus;
        this.elementToFocus.focus();
      } else {
        this.emitDirectionalLimitReached(dir);
        this.elementToFocus = undefined;
      }
    }

    /**
     * Emit the {@link XEvent} associated to the navigation's direction when reaching its limit.
     *
     * @param direction - The navigation direction.
     * @internal
     */
    private emitDirectionalLimitReached(direction: ArrowKey): void {
      const xEvent = this.eventsForDirectionLimit?.[direction];
      if (xEvent) {
        this.$x.emit(xEvent, undefined, { target: this.elementToFocus });
      }
    }
  }
</script>

<docs>
  #Example

  This component has a slot to inject other components inside it. The component expects a required
  prop, navigationHijacker, which is an array of objects containing: the xEvent to listen to, the
  moduleName in charge of emitting the event and to which direction it should react to; to take
  control of the navigation. It has another prop, optional in this case, to emit an xEvent when
  reaching the navigation limit in any direction.

  ## Basic Usage

  ```vue
  <KeyboardNavigation>
    <QuerySuggestions/>
  </KeyboardNavigation>
  ```

  ## Defining multiple conditions to take navigation's control

  ```vue
  <KeyboardNavigation
    :navigationHijacker="[{
      xEvent: 'UserPressedArrowKey',
      moduleName: 'searchBox',
      direction: 'ArrowDown'
    }, {
      xEvent: 'UserPressedArrowKey',
      moduleName: 'facets',
      direction: 'ArrowRight'
    }]"
  >
    <QuerySuggestions/>
  </KeyboardNavigation>
  ```

  ## Defining events to emit when reaching a navigation limit

  ```vue
  <KeyboardNavigation
    :navigationHijacker="[{
      xEvent: 'UserPressedArrowKey',
      moduleName: 'searchBox',
      direction: 'ArrowDown'
    }]"
    :eventsForDirectionLimit="{
      ArrowUp: 'UserReachedEmpathizeTop'
    }"
  >
    <QuerySuggestions/>
  </KeyboardNavigation>
  ```
  ---
  id: x-components.basekeyboardnavigation
  title: Base Keyboard Navigation
  sidebar_label: Base Keyboard Navigation
  ---
</docs>
