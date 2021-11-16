<script lang="ts">
import Vue from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
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
  protected snippetConfig!: SnippetConfig;

  /**
   * The consent to be emitted.
   *
   * @public
   */
  @Prop({ default: undefined })
  protected consent!: boolean | undefined;

  /**
   * Emits the consent passed as prop.
   *
   * @internal
   */
  mounted(): void {
    this.emitConsentProvided(this.consent);
  }

  /**
   *  Emits the event {@link TaggingXEvents.ConsentProvided} when the snippet config consent changed.
   *
   * @param consent - The new consent value.
   *
   * @internal
   */
  @Watch('snippetConfig.consent')
  consentChanged(consent: boolean): void {
    this.emitConsentProvided(consent);
  }

  /**
   * Emits the event {@link TaggingXEvents.ConsentProvided} if it is not undefined.
   *
   * @param value - The consent to be emitted.
   *
   * @internal
   */
  protected emitConsentProvided(value: boolean): void {
    if (value !== undefined) {
      this.$x.emit('ConsentProvided', value);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(): void {}
}
</script>


<docs lang="mdx">
## Events

This component emits the following events:

- [`ConsentProvided`](./../../api/x-components.taggingxevents.consentprovided.md)

## See it in action

This component manages the tagging of the API to track the different features. This
component doesn't render elements to the DOM.

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

In this example, the `Tagging` component will emit `ConsentProvided` only if the consent is set to true.

```vue
<template>
  <Tagging :consent="true" />
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

The `Tagging` will emit the `ConsentProvided` when the component is loaded and the consent is set
by the prop or getting the value from the snippet config.
</docs>
