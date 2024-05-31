<template>
  <div
    ref="el"
    @keydown.up.down.right.left.prevent="focusNextNavigableElement"
    class="x-keyboard-navigation"
    data-test="keyboard-navigation"
  >
    <!-- @slot (Required) Container content -->
    <slot />
  </div>
</template>

<script lang="ts">
  import { PropType, computed, defineComponent, onMounted, ref } from 'vue';
  // eslint-disable-next-line max-len
  import { DirectionalFocusNavigationService } from '../services/directional-focus-navigation.service';
  import { SpatialNavigation } from '../services/services.types';
  import { ArrowKey, EventsForDirectionLimit, TakeNavigationControl } from '../utils/types';
  import { XEventsOf } from '../wiring/events.types';
  import { WireMetadata } from '../wiring/wiring.types';
  import { use$x, useXBus } from '../composables';

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
  export default defineComponent({
    name: 'BaseKeyboardNavigation',
    props: {
      /**
       * An array of {@link TakeNavigationControl} objects defining when to
       * take control of the keyboard navigation.
       */
      navigationHijacker: {
        type: Array as PropType<TakeNavigationControl[]>,
        default: () => [
          { xEvent: 'UserPressedArrowKey', moduleName: 'searchBox', direction: 'ArrowDown' }
        ]
      },
      /**
       * An {@link EventsForDirectionLimit} to emit when the user is already at the furthest element
       * in a direction and tries to keep going on the same direction.
       */
      eventsForDirectionLimit: {
        type: Object as PropType<Partial<EventsForDirectionLimit>>,
        default: () => ({ ArrowUp: 'UserReachedEmpathizeTop' })
      }
    },
    setup: function (props) {
      const el = ref<HTMLElement>();

      const $x = use$x();
      const xBus = useXBus();

      /**
       * The {@link SpatialNavigation} service to use.
       */
      let navigationService!: SpatialNavigation;

      /**
       * The element to focus.
       */
      let elementToFocus: HTMLElement | undefined;

      /**
       * Get the navigation hijacker events.
       *
       * @remarks
       * If the same {@link XEvent} is defined multiple times it is only inserted once.
       *
       * @returns The events to hijack the navigation.
       */
      const navigationHijackerEvents = computed((): XEventsOf<ArrowKey>[] => {
        const eventsSet = props.navigationHijacker.map(({ xEvent }) => xEvent);
        return Array.from(new Set(eventsSet));
      });

      onMounted(() => {
        // TODO Replace this with injection
        navigationService = new DirectionalFocusNavigationService(el.value!);
      });

      /**
       * Checks if the component has to take control of the keyboard navigation.
       *
       * @param eventPayload - The {@link ArrowKey}.
       * @param metadata - The {@link WireMetadata}.
       *
       * @returns Whether the component needs to take control of the keyboard navigation or not.
       * @internal
       */
      function hasToTakeNavigationControl(eventPayload: ArrowKey, metadata: WireMetadata): boolean {
        return props.navigationHijacker.some(
          ({ moduleName, direction }) =>
            moduleName === metadata.moduleName && direction === eventPayload
        );
      }

      /**
       * Focus the next navigable element returned by the navigation service.
       *
       * @param direction - The navigation direction.
       * @internal
       */
      function focusNextNavigableElement(direction: ArrowKey | KeyboardEvent): void {
        const dir = typeof direction === 'object' ? (direction.key as ArrowKey) : direction;
        const nextElementToFocus = navigationService?.navigateTo(dir);

        if (elementToFocus !== nextElementToFocus) {
          elementToFocus = nextElementToFocus;
          elementToFocus.focus();
        } else {
          emitDirectionalLimitReached(dir);
          elementToFocus = undefined;
        }
      }

      /**
       * Emit the {@link XEvent} associated to the navigation's direction when reaching its limit.
       *
       * @param direction - The navigation direction.
       * @internal
       */
      function emitDirectionalLimitReached(direction: ArrowKey): void {
        const xEvent = props.eventsForDirectionLimit?.[direction];
        if (xEvent) {
          $x.emit(xEvent, undefined, { target: elementToFocus });
        }
      }

      /**
       * Trigger navigation if this component is in control of it.
       *
       * @param eventPayload - The {@link @empathyco/x-bus#SubjectPayload.eventPayload}.
       * @param metadata - The {@link @empathyco/x-bus#SubjectPayload.metadata}.
       * @public
       */
      navigationHijackerEvents.value.forEach(event => {
        xBus.on(event, true).subscribe(({ eventPayload, metadata }) => {
          if (hasToTakeNavigationControl(eventPayload, metadata)) {
            focusNextNavigableElement(eventPayload);
          }
        });
      });

      return { el, focusNextNavigableElement };
    }
  });
</script>

<docs lang="mdx">
## Events

An event that the component will emit:

- [`UserReachedEmpathizeTop`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts):
  the event emitted by default when the container reaches its top navigation, but more events can be
  emitted for each direction using the `eventsForDirectionLimit` prop.

## Examples

This component has a slot to inject other components inside it. The component expects a required
prop, navigationHijacker, which is an array of objects containing: the xEvent to listen to, the
moduleName in charge of emitting the event and to which direction it should react to; to take
control of the navigation. It has another prop, optional in this case, to emit an xEvent when
reaching the navigation limit in any direction.

### Basic Usage

```vue
<KeyboardNavigation>
  <QuerySuggestions/>
</KeyboardNavigation>
```

### Defining multiple conditions to take navigation's control

```vue
<KeyboardNavigation
  :navigationHijacker="[
    {
      xEvent: 'UserPressedArrowKey',
      moduleName: 'searchBox',
      direction: 'ArrowDown'
    },
    {
      xEvent: 'UserPressedArrowKey',
      moduleName: 'facets',
      direction: 'ArrowRight'
    }
  ]"
>
  <QuerySuggestions/>
</KeyboardNavigation>
```

### Defining events to emit when reaching a navigation limit

```vue
<KeyboardNavigation
  :navigationHijacker="[
    {
      xEvent: 'UserPressedArrowKey',
      moduleName: 'searchBox',
      direction: 'ArrowDown'
    }
  ]"
  :eventsForDirectionLimit="{
    ArrowUp: 'UserReachedEmpathizeTop'
  }"
>
  <QuerySuggestions/>
</KeyboardNavigation>
```
</docs>
