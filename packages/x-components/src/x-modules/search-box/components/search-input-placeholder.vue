<template>
  <component
    :is="animation"
    v-if="isVisible"
    class="x-input-placeholder x-search-input-placeholder"
    mode="out-in"
  >
    <span :key="message" data-test="search-input-placeholder">
      {{ message }}
    </span>
  </component>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { animateTranslate, State, xComponentMixin, XOn } from '../../../components';
  import { searchBoxXModule } from '../x-module';

  /**.
   * This component renders an animated placeholder for the search input in the shape of a list of
   * iterating messages that can be configured to happen always or only when hovering the input
   *
   * @public
   */
  @Component({
    mixins: [xComponentMixin(searchBoxXModule)]
  })
  export default class SearchInputPlaceholder extends Vue {
    /**
     * List of messages to animate.
     *
     * @public
     */
    @Prop({ required: true })
    protected messages!: Array<string>;

    /**
     * Animation component used for the messages.
     *
     * @public
     */
    @Prop({ default: () => animateTranslate('bottom-to-top') })
    protected animation!: Vue;

    /**
     * Time in milliseconds during which each message is visible.
     *
     * @public
     */
    @Prop({ default: 1500 })
    protected animationIntervalMs!: number;

    /**
     * Whether the messages animation is active only when hovering the search input or always.
     *
     * @public
     */
    @Prop({ default: false })
    protected animateOnlyOnHover!: boolean;

    /**.
     * The search box written query
     *
     * @internal
     */
    @State('searchBox', 'query')
    public query!: string;

    /**.
     * The search box hover status
     *
     * @internal
     */
    protected isSearchBoxHovered = false;

    /**.
     * The search box focus status
     *
     * @internal
     */
    protected isSearchBoxFocused = false;

    /**
     * The index used to point to the current animation message in the list.
     *
     * @internal
     */
    protected animationMessageIndex = 0;

    /**
     * The interval used for the animation.
     *
     * @internal
     */
    protected animationInterval: number | undefined;

    /**
     * The visibility state of the component.
     *
     * @returns The visibility state based on the search input state (query & focus).
     *
     * @internal
     */
    protected get isVisible(): boolean {
      return !this.query && !this.isSearchBoxFocused;
    }

    /**
     * The animation state of the component.
     *
     * @returns Whether the animation is active or not.
     *
     * @internal
     */
    protected get isBeingAnimated(): boolean {
      return this.isVisible && (!this.animateOnlyOnHover || this.isSearchBoxHovered);
    }

    /**
     * The current placeholder message.
     *
     * @returns The message to display as placeholder at any moment.
     *
     * @internal
     */
    protected get message(): string | undefined {
      return this.isBeingAnimated ? this.messages[this.animationMessageIndex] : this.messages[0];
    }

    /**
     * Starts or stops the animation depending on the current animation state.
     *
     * @internal
     */
    @Watch('isBeingAnimated', { immediate: true })
    @Watch('messages', { deep: true })
    @Watch('animationIntervalMs')
    protected resetAnimation(): void {
      this.stopAnimationInterval();

      if (this.isBeingAnimated) {
        this.animationInterval = setInterval((): void => {
          this.incrementAnimationMessageIndex();
        }, this.animationIntervalMs);
      }
    }

    /**
     * Clears the interval used for the animation.
     *
     * @internal
     */
    protected stopAnimationInterval(): void {
      if (this.animationInterval) {
        clearInterval(this.animationInterval);
        this.animationInterval = undefined;
      }
    }

    /**
     * Increments animation message index; if the new index exceeds the messages list length, it is
     * reset to 0.
     *
     * @internal
     */
    protected incrementAnimationMessageIndex(): void {
      this.animationMessageIndex = (this.animationMessageIndex + 1) % this.messages.length;
    }

    /**
     * Sets the animation message index with the right value for the next future iteration when the
     * current one stops,assuring the user will see always a new message on each animation state
     * change.
     *
     * @internal
     */
    @Watch('isBeingAnimated', { immediate: true })
    protected prepareMessageIndexForNextAnimation(): void {
      if (!this.isBeingAnimated) {
        if (this.animateOnlyOnHover) {
          this.resetAnimationMessageIndex();
        }
        this.incrementAnimationMessageIndex();
      }
    }

    /**
     * Resets the animation message index to zero.
     *
     * @internal
     */
    @Watch('messages', { deep: true })
    protected resetAnimationMessageIndex(): void {
      this.animationMessageIndex = 0;
    }

    // TODO: EX-7173 - Get search input state(s) from the store instead of using events
    @XOn('UserHoveredInSearchBox')
    onUserHoveredInSearchBox(): void {
      this.isSearchBoxHovered = true;
    }

    @XOn('UserHoveredOutSearchBox')
    onUserHoveredOutSearchBox(): void {
      this.isSearchBoxHovered = false;
    }

    @XOn('UserFocusedSearchBox')
    onUserFocusedSearchBox(): void {
      this.isSearchBoxFocused = true;
    }

    @XOn('UserBlurredSearchBox')
    onUserBlurredSearchBox(): void {
      this.isSearchBoxFocused = false;
    }

    beforeDestroy(): void {
      this.stopAnimationInterval();
    }
  }
</script>

<style lang="scss" scoped>
  .x-search-input-placeholder {
    display: flex;
    align-items: center;
  }
</style>

<docs lang="mdx">
## See it in action

Here a basic example of how the animated search input placeholder is rendered.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
    />
    <SearchInput />
  </div>
</template>

<script>
  import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputPlaceholderDemo',
    components: {
      SearchInput,
      SearchInputPlaceholder
    },
    data: function () {
      return {
        placeholderMessages: [
          'Find shirts',
          'Find shoes',
          'Find watches',
          'Find handbags',
          'Find sunglasses'
        ]
      };
    }
  };
</script>
```

### Animating only on hover

In this example, the placeholder is configured to animate only when the user hovers in the search
input, showing the first message of the array the rest of the time.

```vue live
<template>
  <div style="position: relative; overflow: hidden;">
    <SearchInputPlaceholder
      style="position: absolute; height: 100%; pointer-events: none;"
      :messages="placeholderMessages"
      :animate-only-on-hover="true"
    />
    <SearchInput />
  </div>
</template>

<script>
  import { SearchInput, SearchInputPlaceholder } from '@empathyco/x-components/search-box';

  export default {
    name: 'SearchInputPlaceholderDemo',
    components: {
      SearchInput,
      SearchInputPlaceholder
    },
    data: function () {
      return {
        placeholderMessages: [
          'Find shirts',
          'Find shoes',
          'Find watches',
          'Find handbags',
          'Find sunglasses'
        ]
      };
    }
  };
</script>
```
</docs>
