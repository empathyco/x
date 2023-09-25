<template>
  <a
    ref="el"
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
  import { defineComponent, inject, PropType, ref } from 'vue';
  import { PropsWithType } from '../../utils/types';
  import { XEventsTypes } from '../../wiring/events.types';
  import { use$x } from '../../composables/index';
  import { WireMetadata } from '../../wiring';

  /**
   * Component to be reused that renders an `<a>` wrapping the result contents.
   *
   * @remarks
   * It has the logic to emit {@link XEventsTypes.UserClickedAResult} to the bus on click mouse
   * events. Additionally, this component may be injected other events to be emitted on click
   * event, so, depending on where it's used its father component may provide this events.
   *
   * @public
   */
  export default defineComponent({
    props: {
      /**
       * (Required) The {@link @empathyco/x-types#Result} information.
       *
       * @public
       */
      result: {
        type: Object as PropType<Result>,
        required: true
      }
    },
    setup(props) {
      const $x = use$x();

      /**
       * The rendered DOM element.
       *
       * @internal
       */
      const el = ref<HTMLElement | null>();

      /**
       * The list of additional events to be emitted by the component when user clicks the link.
       *
       * @internal
       */
      const resultClickExtraEvents = inject<PropsWithType<XEventsTypes, Result>[]>(
        'resultClickExtraEvents',
        []
      );

      /**
       * The metadata to be injected in the events emitted by the component. This component can emit
       * have extra events so this record pairs each event to its metadata.
       */
      const resultLinkMetadataPerEvent = inject<
        // TODO: Refactor this inject key to the constants when doing EMP-909
        Partial<
          Record<
            PropsWithType<XEventsTypes, Result>,
            Omit<WireMetadata, 'moduleName' | 'origin' | 'location'>
          >
        >
      >('resultLinkMetadataPerEvent', {});

      /**
       * Emits the {@link XEventsTypes.UserClickedAResult} when user clicks on the result, and also
       * additional events if have been injected in the component.
       *
       * @internal
       */
      const emitUserClickedAResult = (): void => {
        $x.emit('UserClickedAResult', props.result, {
          target: el.value!,
          ...resultLinkMetadataPerEvent['UserClickedAResult']
        });
        resultClickExtraEvents.forEach(event => {
          $x.emit(event, props.result, { target: el.value!, ...resultLinkMetadataPerEvent[event] });
        });
      };

      return {
        emitUserClickedAResult
      };
    }
  });
</script>

<style lang="scss" scoped>
  .x-result-link {
    text-decoration: none;
  }
</style>

<docs lang="mdx">
## Events

This component emits the following event:

- [`UserClickedAResult`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

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
