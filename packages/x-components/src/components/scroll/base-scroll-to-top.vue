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
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { XOn } from '../../components/decorators/bus.decorators';
  import { WireMetadata, XEventsTypes } from '../../wiring';
  import BaseEventButton from '../base-event-button.vue';
  import { NoElement } from '../no-element';
  import { ScrollDirection } from './scroll.types';

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
    components: { BaseEventButton }
  })
  export default class BaseScrollToTop extends Vue {
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
     * The current position of the target scroll.
     *
     * @internal
     */
    protected scrollTop = 0;

    /**
     * The last direction of the target scroll.
     *
     * @internal
     */
    protected scrollDirection: ScrollDirection = 'UP';

    /**
     * Whether if scroll has almost reached the scroll end or not in target scroll.
     *
     * @internal
     */
    protected hasAlmostReachedScrollEnd = false;

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
      return this.useThresholdStrategy && this.scrollTop > (this.thresholdPx as number);
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
     * Verifies if the ids match.
     *
     * @param id - The id of the scroll.
     * @returns If the id received is the same as the scroll to top id.
     * @internal
     */
    protected isThisScroll(id?: string): boolean {
      return id === this.scrollId;
    }

    /**
     * Validates when the target scroll component has almost reached the end of the scroll.
     *
     * @param _payload - {@link XEventsTypes.UserAlmostReachedScrollEnd}.
     * @param metadata - Associated data of the event, including the id.
     * @internal
     */
    @XOn('UserAlmostReachedScrollEnd')
    enableHasAlmostReachedScrollEnd(_payload: unknown, metadata: WireMetadata): void {
      if (this.isThisScroll(metadata.id)) {
        this.hasAlmostReachedScrollEnd = true;
      }
    }

    /**
     * Updates the scroll direction of the target scroll component.
     *
     * @param scrollDirection - The last direction {@link XEventsTypes.UserChangedScrollDirection}.
     * @param metadata - Associated data of the event, including the id.
     * @internal
     */
    @XOn('UserChangedScrollDirection')
    storeScrollDirection(scrollDirection: ScrollDirection, metadata: WireMetadata): void {
      if (this.isThisScroll(metadata.id)) {
        this.scrollDirection = scrollDirection;
      }
    }

    /**
     * Updates the scrollTop property with the value of the target scroll component.
     *
     * @param scrollPosition - The number of pixels that the target has been scrolled
     * {@link XEventsTypes.UserScrolled}.
     * @param metadata - Associated data of the event, including the id.
     * @internal
     */
    @XOn('UserScrolled')
    storeScrollPosition(scrollPosition: number, metadata: WireMetadata): void {
      if (this.isThisScroll(metadata.id)) {
        this.scrollTop = scrollPosition;
      }
    }

    /**
     * Checks if the scroll has almost reached the end when the scroll direction changes.
     *
     * @param scrollDirection - The new scroll direction.
     * @internal
     */
    @Watch('scrollDirection')
    updateHasAlmostReachedScrollEnd(scrollDirection: ScrollDirection): void {
      this.hasAlmostReachedScrollEnd = this.hasAlmostReachedScrollEnd && scrollDirection === 'DOWN';
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
    <BaseScrollToTop scroll-id="scrollId" :threshold-px="1000">
      <span>Scroll to top</span>
    </BaseScrollToTop>
  </div>
</template>

<script>
  import { BaseScrollToTop } from '@empathyco/x-components';

  export default {
    name: 'ScrollToTopTest',
    components: {
      BaseScrollToTop
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserClickedScrollToTop`: the event is emitted after the user clicks the button. The event payload
  is the id of the scroll that it going to be scrolled.
</docs>
