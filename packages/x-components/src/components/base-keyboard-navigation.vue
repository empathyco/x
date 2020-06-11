<template>
  <div
    @keydown.up.down.right.left="focusNextNavigableElement"
    class="x-keyboard-navigation"
    data-test="keyboard-navigation"
  >
    <!-- @slot (Required) to add content to the container -->
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
    PropsWithType,
    TakeNavigationControl
  } from '../utils/types';
  import { XEventsTypes } from '../wiring/events.types';
  import { WirePayload } from '../wiring/wiring.types';

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
      this.createSubscriptions();
    }

    /**
     * Creates the necessary subscriptions to {@link XEvent | xEvents}.
     *
     * @internal
     */
    private createSubscriptions(): void {
      // TODO Refactor this when https://searchbroker.atlassian.net/browse/EX-1977 is done
      const eventsSet = new Set<PropsWithType<XEventsTypes, ArrowKey>>();
      this.navigationHijacker.forEach(({ xEvent }) => eventsSet.add(xEvent));
      eventsSet.forEach(xEvent => {
        const subscription = this.$x.on(xEvent, true).subscribe(this.triggerNavigation.bind(this));
        this.$on('hook:beforeDestroy', () => subscription.unsubscribe());
      });
    }

    /**
     * Trigger navigation if this component is in control of it.
     *
     * @param payload - {@link WirePayload}.
     * @public
     */
    triggerNavigation(payload: WirePayload<ArrowKey>): void {
      if (this.hasToTakeNavigationControl(payload)) {
        this.focusNextNavigableElement(payload.eventPayload);
      }
    }

    /**
     * Checks if the component has to take control of the keyboard navigation.
     *
     * @param payload - {@link WirePayload}.
     *
     * @returns Whether the component needs to take control of the keyboard navigation or not.
     * @internal
     */
    private hasToTakeNavigationControl(payload: WirePayload<ArrowKey>): boolean {
      const { eventPayload, metadata } = payload;

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
      const nextElementToFocus = this.navigationService.navigateTo(dir);

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
</docs>
