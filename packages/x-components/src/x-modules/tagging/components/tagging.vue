<script lang="ts">
  import Vue from 'vue';
  import { Component, Inject, Prop } from 'vue-property-decorator';
  import { XEmit } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { taggingXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(taggingXModule)]
  })
  export default class Tagging extends Vue {
    /**
     * It injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     *
     * @internal
     */
    @Inject('snippetConfig')
    protected snippetConfig?: SnippetConfig;

    /**
     * The session TTL in milliseconds.
     *
     * @internal
     */
    @Prop()
    @XEmit('SessionDurationProvided')
    public sessionTTLMs: number | undefined;

    /**
     * The debounce time in milliseconds to track the query.
     *
     * @internal
     */
    @Prop()
    @XEmit('QueryTaggingDebounceProvided')
    public queryTaggingDebounceMs: number | undefined;

    /**
     * The consent to be emitted.
     *
     * @public
     */
    @Prop()
    protected consent?: boolean;

    /**
     * The active consent, selected from the `consent` prop and the `snippetConfig.consent`
     * property. False by default.
     *
     * @returns A boolean that represents if the consent is accepted or not.
     */
    @XEmit('ConsentProvided')
    public get activeConsent(): boolean {
      return this.consent ?? this.snippetConfig?.consent ?? false;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`ConsentProvided`](./../../api/x-components.taggingxevents.consentprovided.md)
- [`SessionDurationProvided`](./../../api/x-components.taggingxevents.sessiondurationprovided.md)
- `QueryTaggingDebounceProvided`[1]
  [1](./../../api/x-components.taggingxevents.querytaggingdebounceprovided.md)

## See it in action

This component manages the tagging of the API to track the different features. This component
doesn't render elements to the DOM.

```vue
<template>
  <Tagging />
</template>

<script>
  import { Tagging } from '@empathyco/x-components/tagging';

  export default {
    name: 'TaggingDemo',
    components: {
      Tagging
    }
  };
</script>
```

### Play with props

In this example, the `Tagging` component will emit `ConsentProvided` only if the consent is set to
true, the `SessionDurationProvided` and `QueryTaggingDebounceProvided` events will be emitted only
if the props are defined.

```vue
<template>
  <Tagging :consent="true" :queryTaggingDebounceMs="300" :sessionDurationMs="30000" />
</template>

<script>
  import { Tagging } from '@empathyco/x-components/tagging';

  export default {
    name: 'TaggingDemo',
    components: {
      Tagging
    }
  };
</script>
```

### Play with events

The `Tagging` will emit the `ConsentProvided` when the component is loaded and the consent is set by
the prop or getting the value from the snippet config.

The `Tagging` will emit the `SessionDurationProvided` when the component is loaded with a session
duration using the prop.

The `Tagging` will emit the `QueryTaggingDebounceProvided` when the component is loaded with query
debounce using the prop.
</docs>
