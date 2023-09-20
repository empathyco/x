<template>
  <BaseEventButton
    v-on="$listeners"
    :events="events"
    class="x-query-preview-button x-button"
    data-test="query-preview-button"
  >
    <!-- @slot Button content with a text, an icon or both -->
    <slot :queryPreviewInfo="fullQueryPreviewInfo">
      {{ queryPreviewInfo.query }}
    </slot>
  </BaseEventButton>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';
  import { Dictionary } from '@empathyco/x-utils';
  import { State } from '../../../components/decorators/store.decorators';
  import { QueryPreviewInfo } from '../store/types';
  import { XEventsTypes } from '../../../wiring/events.types';
  import { BaseEventButton, xComponentMixin } from '../../../components';
  import { queriesPreviewXModule } from '../x-module';

  /**
   * Component containing an event button that emits
   * {@link QueriesPreviewXEvents.UserAcceptedAQueryPreview} when clicked with
   * the full query preview info as payload.
   *
   * It has a default slot to customize its contents.
   *
   * @public
   */
  @Component({
    components: { BaseEventButton },
    mixins: [xComponentMixin(queriesPreviewXModule)]
  })
  export default class QueryPreviewButton extends Vue {
    /**
     * The information about the request of the query preview.
     *
     * @public
     */
    @Prop({ required: true })
    protected queryPreviewInfo!: QueryPreviewInfo;

    /**
     * We use the module extra params to combine them with the query preview's extra params.
     */
    @State('queriesPreview', 'params')
    public params!: Dictionary<unknown>;

    /**
     * The provided query preview with the base extra params from the module merged in.
     *
     * @returns The query preview info with the base extra params merged in.
     * @public
     */
    protected get fullQueryPreviewInfo(): QueryPreviewInfo {
      return {
        ...this.queryPreviewInfo,
        extraParams: {
          ...this.params,
          ...this.queryPreviewInfo.extraParams
        },
        filters: this.queryPreviewInfo.filters
      };
    }

    /**
     * List of events to emit by the BaseEventButton.
     *
     * @returns An object with the event and payload.
     *
     * @internal
     */
    protected get events(): Partial<XEventsTypes> {
      return { UserAcceptedAQueryPreview: this.fullQueryPreviewInfo };
    }
  }
</script>

<docs lang="mdx">
## Examples

### Basic example

The component content has the query preview query as default

```vue
<template>
  <div>
    <QueryPreviewButton queryPreviewInfo="queryPreviewInfo" />
  </div>
</template>

<script>
  import { QueryPreviewButton } from '@empathyco/x-components/queries-preview';

  export default {
    components: {
      QueryPreviewButton
    },
    data: function () {
      return {
        queryPreviewInfo: {
          query: 'shoes'
        }
      };
    }
  };
</script>
```

### Customizing slots

The content of the button is customizable via its default slot

```vue
<template>
  <div>
    <QueryPreviewButton queryPreviewInfo="queryPreviewInfo">
      {{ `Search for: ${queryPreviewInfo.query}` }}
    </QueryPreviewButton>
  </div>
</template>

<script>
  import { QueryPreviewButton } from '@empathyco/x-components/queries-preview';

  export default {
    components: {
      QueryPreviewButton
    },
    data: function () {
      return {
        queryPreviewInfo: {
          query: 'shoes'
        }
      };
    }
  };
</script>
```

## Events

A list of events that the component will emit:

- `UserAcceptedAQueryPreview`: the event is emitted after the user clicks the button. The event
  payload is the `QueryPreviewInfo` of the query.
</docs>
