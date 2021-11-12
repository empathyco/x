<template>
  <component :is="animation">
    <BaseEventButton
      v-if="isVisible"
      v-on="$listeners"
      class="x-button x-scroll-to-top"
      data-test="scroll-to-top"
      :events="events"
    >
      <!-- @slot (Required) Button content with a text, an icon or both -->
      <slot />
    </BaseEventButton>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { State, xComponentMixin } from '../../../components';
  import BaseEventButton from '../../../components/base-event-button.vue';
  import { NoElement } from '../../../components/no-element';
  import { Dictionary } from '../../../utils';
  import { XEventsTypes } from '../../../wiring';
  import { ScrollComponentState } from '../store';
  import { scrollXModule } from '../x-module';

  /**
   * Renders a button with a default slot.
   * This button will emit a UserClickedScrollToTop when clicked.
   * The button will be shown either if it reaches a threshold and then the user scrolls up or
   * just on the UserAlmostReachedScrollEnd event depending on whether the threshold config has been
   * provided or not.
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(scrollXModule)],
    components: { BaseEventButton }
  })
  export default class ScrollToTop extends Vue {
    /**
     * Animation to use for showing/hiding the button.
     *
     * @public
     */
    @Prop({ default: () => NoElement })
    public animation!: Vue | string;

    /**
     * Threshold in pixels from the top to show the button.
     *
     * @public
     */
    @Prop()
    public thresholdPx?: number;

    /**
     * Id of the target scroll component.
     *
     * @public
     */
    @Prop()
    public scrollId?: string;

    /**
     * State of all the scroll components in this module.
     *
     * @internal
     */
    // TODO: Directly retrieve the needed data in this computed property
    @State('scroll', 'data')
    public scrollPositionsMap!: Dictionary<ScrollComponentState>;

    /**
     * The scroll data retrieved for this component.
     *
     * @returns The scroll data for this component if a valid {@link ScrollToTop.scrollId} has been
     * passed. Otherwise it returns `null`.
     * @internal
     */
    protected get scrollData(): ScrollComponentState {
      return this.scrollId && this.scrollPositionsMap[this.scrollId]
        ? this.scrollPositionsMap[this.scrollId]
        : {
            position: 0,
            direction: 'UP',
            hasReachedStart: false,
            hasAlmostReachedEnd: false,
            hasReachedEnd: false
          };
    }

    /**
     * Event that will be emitted when the scroll to top is clicked.
     *
     * @returns The event to be emitted when the scroll to top is clicked. The id as a payload.
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return { UserClickedScrollToTop: this.scrollId };
    }

    /**
     * Checks if the thresholdPx prop has been provided and if it is a number.
     *
     * @returns If the thresholdPx is a number or not.
     * @internal
     */
    protected get useThresholdStrategy(): boolean {
      return typeof this.thresholdPx === 'number';
    }

    /**
     * Checks if the threshold has been reached in case the threshold strategy is in use.
     *
     * @returns If the scrollTop is bigger than the thresholdPx.
     * @internal
     */
    protected get isThresholdReached(): boolean {
      return this.useThresholdStrategy && this.scrollData.position > this.thresholdPx!;
    }

    /**
     * Whether if the button is visible or not depending on the strategy being used.
     *
     * @returns If the button should be visible or not.
     * @internal
     */
    protected get isVisible(): boolean {
      return this.useThresholdStrategy ? this.isThresholdReached : this.hasAlmostReachedScrollEnd;
    }

    /**
     * Returns if the scroll has almost reached its end or not.
     *
     * @returns True if the scroll has almost reached the end and the user is still scrolling down.
     * @internal
     */
    protected get hasAlmostReachedScrollEnd(): boolean {
      return this.scrollData.hasAlmostReachedEnd && this.scrollData.direction === 'DOWN';
    }
  }
</script>

<docs lang="mdx">
# Examples

## Basic example

The component renders whatever is passed to it in the default slot and scrolls to top the scroll
with an id `scrollId`.

It also receives an optional threshold in pixels. When the threshold is reached from the top, the
component will be shown once the user scrolls `UP`.

If this parameter is not provided the button will be visible when the user almost reaches the end of
the scroll.

```vue
<template>
  <div>
    <ScrollToTop scroll-id="scrollId" :threshold-px="1000">
      <span>Scroll to top</span>
    </ScrollToTop>
  </div>
</template>

<script>
  import { ScrollToTop } from '@empathyco/x-components';

  export default {
    name: 'ScrollToTopTest',
    components: {
      ScrollToTop
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedScrollToTop`: the event is emitted after the user clicks the button. The event payload
  is the id of the scroll that it going to be scrolled.
</docs>
