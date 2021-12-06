<template>
  <a
    @click="emitUserClickedAResult"
    @click.right="emitUserClickedAResult"
    @click.middle="emitUserClickedAResult"
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
  import { PropsWithType } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';

  /**
   * Component to be reused that renders an `<a>` wrapping the result contents.
   *
   * @remarks
   * It has the logic to emit {@link XEventsTypes.UserClickedAResult} to the bus on click mouse
   * events. Additionally, this component may be injected other events to be emitted on click
   * event, so, depending where it's used its father component may provide this events.
   *
   * @public
   */
  @Component
  export default class BaseResultLink extends Vue {
    /**
     * The rendered DOM element.
     *
     * @internal
     */
    public $el!: HTMLElement;
    /**
     * The list of additional events to be emitted by the component when user clicks the link.
     *
     * @internal
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
     * Emits the {@link XEventsTypes.UserClickedAResult} when user clicks on the result, and also
     * additional events if have been injected in the component.
     *
     * @internal
     */
    protected emitUserClickedAResult(): void {
      this.$x.emit('UserClickedAResult', this.result, { target: this.$el });
      this.resultClickExtraEvents.forEach(event => {
        this.$x.emit(event, this.result, { target: this.$el });
      });
    }
  }
</script>

<style lang="scss" scoped>
  .x-result-link {
    text-decoration: none;
  }
</style>

<docs lang="mdx">
## Events

This component emits the following event:

- [`UserClickedAResult`](x-components.xeventstypes.userclickedaresult.md)

The component can emit more events on click using the `resultClickExtraEvents` prop.

## See it in action

This component is a wrapper for the result contents (images, name, price...) It may be part of the
search result page, recommendations or other section which needs to include results.

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
</docs>
