<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import { Dictionary } from '../utils';
  import { ExtraParamXEvent } from '../wiring';
  import { SnippetConfig } from '../x-installer';
  import { XInject } from './decorators/injection.decorators';

  /**
   * It emits a list of {@link ExtraParamXEvent} and the values, which are merged
   * with the extra params from the snippet config, passed as properties.
   *
   * Each extra param is emitted by each event.
   *
   * By default if there is an extra param passed as prop, it will override
   * the snippet config in case it exists.
   *
   * @public
   */
  @Component
  export default class BaseExtraParams extends Vue {
    /**
     * An array where the values are the {@link ExtraParamXEvent}.
     * By default this component emits the 'UserChangedRequestParams' event.
     *
     * @public
     */
    @Prop({ default: () => ['UserChangedRequestParams'] })
    protected events!: ExtraParamXEvent[];

    /**
     * (Required) A record where the keys are the extra params and the
     * value.
     *
     * @public
     */
    @Prop({ required: true })
    protected values!: Record<string, any>;

    /**
     * It injects {@link SnippetConfig} provided by an ancestor.
     *
     * @internal
     */
    @XInject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    /**
     * Computed property that returns the combination of the
     * extra params from the props and the snippet config.
     *
     * @remarks In the merge strategy the props have more priority than the snippet.
     *
     * @returns An object with the extra params.
     *
     * @internal
     */
    protected get extraParams(): Dictionary {
      const {
        _instance,
        _env,
        _lang,
        _searchLang,
        _scope,
        _consent,
        _currency,
        _documentDirection,
        ...extraParams
      } = this.snippetConfig ?? {};

      return {
        ...extraParams,
        ...this.values
      };
    }

    /**
     * Emits the events passed as prop with the new extra param values.
     *
     * @param newExtraParams - New extra params.
     * @param oldExtraParams - Previous extra params.
     *
     * @internal
     */
    @Watch('extraParams', { immediate: true, deep: true })
    protected syncExtraParams(
      newExtraParams: Record<string, any>,
      oldExtraParams: Record<string, any>
    ): void {
      this.events.forEach(event => {
        Object.entries(newExtraParams).forEach(([key, value]) => {
          if (!oldExtraParams || newExtraParams[key] !== oldExtraParams[key]) {
            this.$x.emit(event, { [key]: value });
          }
        });
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

This component could emits the following events:

- `UserChangedSearchRequestParam`
- `UserChangedNextQueriesRequestParam`
- `UserChangedRelatedTagsRequestParam`
- `UserChangedPopularSearchesRequestParam`
- `UserChangedRecommendationsRequestParam`,
- `UserChangedQuerySuggestionsRequestParam`
- `UserChangedRequestParam`

## See it in action

### Play with events

In this example, the `UserChangedRequestParam` event is emitted by default.

_See how the event is triggered when the component is rendered._

```vue
<template>
  <BaseExtraParams :values="{ warehouse: 123456789 }" />
</template>

<script>
  import { BaseExtraParams } from '@empathyco/x-components/base-extra-params.vue';

  export default {
    name: 'ExtraParamsDemo',
    components: {
      BaseExtraParams
    }
  };
</script>
```

In this example, the `UserChangedPopularSearchesRequestParam` event is emitted.

_See how the event is triggered when the component is rendered._

```vue
<template>
  <BaseExtraParams
    :events="['UserChangedPopularSearchesRequestParam']"
    :values="{ warehouse: 123456789 }"
  />
</template>

<script>
  import { BaseExtraParams } from '@empathyco/x-components/base-extra-params.vue';

  export default {
    name: 'ExtraParamsDemo',
    components: {
      BaseExtraParams
    }
  };
</script>
```
</docs>
