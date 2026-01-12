<template>
  <BaseEventButton
    :events="events"
    :metadata="metadata"
    class="x-query-preview-button xds:button"
    data-test="query-preview-button"
  >
    <!-- @slot Button content with a text, an icon or both -->
    <slot :query-preview-info="fullQueryPreviewInfo">
      {{ queryPreviewInfo.query }}
    </slot>
  </BaseEventButton>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import type { XEventsTypes } from '../../../wiring/events.types'
import type { WireMetadata } from '../../../wiring/index'
import type { QueryPreviewInfo } from '../store/types'
import { computed, defineComponent } from 'vue'
import { BaseEventButton } from '../../../components'
import { useState } from '../../../composables/use-state'
import { queriesPreviewXModule } from '../x-module'

/**
 * Component containing an event button that emits
 * {@link QueriesPreviewXEvents.UserAcceptedAQueryPreview} when clicked with
 * the full query preview info as payload.
 *
 * It has a default slot to customize its contents.
 *
 * @public
 */
export default defineComponent({
  name: 'QueryPreviewButton',
  xModule: queriesPreviewXModule.name,
  components: { BaseEventButton },
  props: {
    /**
     * The information about the request of the query preview.
     *
     * @public
     */
    queryPreviewInfo: {
      type: Object as PropType<QueryPreviewInfo>,
      required: true,
    },
    /**
     * The metadata property for the request on each query preview.
     *
     * @public
     */
    metadata: {
      type: Object as PropType<Omit<WireMetadata, 'moduleName'>>,
    },
  },
  setup(props) {
    /**
     * We use the module extra params to combine them with the query preview's extra params.
     */
    const { params } = useState('queriesPreview')

    /**
     * The provided query preview with the base extra params from the module merged in.
     *
     * @returns The query preview info with the base extra params merged in.
     * @public
     */
    const fullQueryPreviewInfo = computed(
      (): QueryPreviewInfo => ({
        ...props.queryPreviewInfo,
        extraParams: {
          ...params.value,
          ...props.queryPreviewInfo.extraParams,
        },
        filters: props.queryPreviewInfo.filters,
      }),
    )

    /**
     * List of events to emit by the BaseEventButton.
     *
     * @returns An object with the event and payload.
     *
     * @internal
     */
    const events = computed(
      (): Partial<XEventsTypes> => ({ UserAcceptedAQueryPreview: fullQueryPreviewInfo.value }),
    )

    return {
      fullQueryPreviewInfo,
      events,
    }
  },
})
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
import { QueryPreviewButton } from '@empathyco/x-components/queries-preview'

export default {
  components: {
    QueryPreviewButton,
  },
  data: function () {
    return {
      queryPreviewInfo: {
        query: 'shoes',
      },
    }
  },
}
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
import { QueryPreviewButton } from '@empathyco/x-components/queries-preview'

export default {
  components: {
    QueryPreviewButton,
  },
  data: function () {
    return {
      queryPreviewInfo: {
        query: 'shoes',
      },
    }
  },
}
</script>
```

## Events

A list of events that the component will emit:

- `UserAcceptedAQueryPreview`: the event is emitted after the user clicks the button. The event
  payload is the `QueryPreviewInfo` of the query.
</docs>
