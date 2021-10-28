<template>
  <a
    @click="emitUserClickedAResult"
    @click.middle="emitUserClickedAResult"
    @click.right="emitUserRightClickedAResult"
    :href="result.url"
    class="x-result-link"
    data-test="result-link"
  >
    <!--
      @slot (Required) Link content with a text, an image, another component or both
          @binding {Result} result - Result data
     -->
    <slot :result="result" />
  </a>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import { QueryOrigin } from '../../types/query-origin';
  import { PropsWithType } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import { WireMetadata } from '../../wiring/wiring.types';

  /**
   * Component to be reused that renders an `<a>` wrapping the result contents.
   *
   * @remarks
   * It has the logic to emit {@link XEventsTypes.UserClickedAResult} and
   * {@link XEventsTypes.UserRightClickedAResult} to the bus on click mouse events.
   * Additionally, this component may be injected other events to be emitted on click event, so,
   * depending where it's used its father component may provide this events.
   *
   * @public
   */
  @Component
  export default class BaseResultLink extends Vue {
    /**
     * The origin to be sent as part of the `params` property in the
     * {@link @empathyco/x-types#Tagging | tagging} information.
     *
     * @public
     */
    @Inject({ from: 'origin', default: 'default' })
    protected origin!: QueryOrigin;

    /**
     * The list of additional events to be emitted by the component when user clicks the link.
     *
     * @public
     */
    @Inject({ from: 'resultClickExtraEvents', default: [] })
    protected resultClickExtraEvents!: PropsWithType<XEventsTypes, Result>[];

    /**
     * (Required) The {@link @empathyco/x-types#Result | result} information.
     *
     * @public
     */
    @Prop({ required: true })
    protected result!: Result;

    /**
     * The metadata to emit the event.
     *
     * @public
     */
    protected metadata!: Omit<WireMetadata, 'moduleName'>;

    mounted(): void {
      this.metadata = {
        target: this.$el as HTMLElement,
        origin: this.origin
      };
    }

    /**
     * Emits the {@link XEventsTypes.UserClickedAResult} when user clicks on the result, and also
     * additional events if have been injected in the component.
     *
     * @public
     */
    emitUserClickedAResult(): void {
      this.$x.emit('UserClickedAResult', this.result, this.metadata);
      this.resultClickExtraEvents.forEach(event => {
        this.$x.emit(event, this.result, this.metadata);
      });
    }

    /**
     * Emits the {@link XEventsTypes.UserRightClickedAResult} when user right clicks on the result.
     *
     * @public
     */
    emitUserRightClickedAResult(): void {
      this.$x.emit('UserRightClickedAResult', this.result, this.metadata);
    }
  }
</script>

<style lang="scss" scoped>
  .x-result-link {
    text-decoration: none;
  }
</style>

<docs lang="mdx">
# Examples

## Basic example

This component is a wrapper for the result contents (images, name, price...) It may be part of the
search result page, recommendations or other section which needs to include results.

This component will emit `UserClickedAResult` when clicked or middle clicked and
`UserRightClickedAResult` when right clicked.

Additionally, this component may be injected other events to be emitted on click event, so,
depending where it's used its father component may provide this events.

The result prop is required. It will render a `<a></a>` with the href to the result URL:

```vue
<BaseResultLink :result="result">
  <template #default="{ result }">
    <img :src="result.images[0]"/>
    <span>{{ result.name }}</span>
  </template>
</BaseResultLink>
```

## Events

A list of events that the component will emit:

- `UserClickedAResult`: the event is emitted after the user clicks the element. The event payload is
  the result data and the metadata with the target and the origin of the element that emitted it.
- `UserRightClickedAResult`: the event is emitted after the user right clicks the element. The event
  payload is the result data and the metadata with the target and the origin of the element that
  emitted it.
- The component can emit more events on click using the `resultClickExtraEvents` prop.
</docs>
