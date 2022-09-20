<template>
  <ExtraParams :values="extraParams" />
</template>

<script lang="ts">
  import { forEach, Dictionary } from '@empathyco/x-utils';
  import Vue from 'vue';
  import { Component, Watch, Inject, Prop } from 'vue-property-decorator';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { extraParamsXModule } from '../x-module';
  import ExtraParams from './extra-params.vue';

  /**
   * Extracts the extra parameters from the {@link SnippetConfig} and syncs it with the request
   * objects of every x-module.
   *
   * @public
   */
  @Component({
    components: { ExtraParams },
    mixins: [xComponentMixin(extraParamsXModule)]
  })
  export default class SnippetConfigExtraParams extends Vue {
    /**
     * It injects {@link SnippetConfig} provided by an ancestor as snippetConfig.
     *
     * @internal
     */
    @Inject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    /**
     * A Dictionary where the keys are the extra param names and its values.
     *
     * @public
     */
    @Prop()
    protected values?: Dictionary<unknown>;

    /**
     * Custom object containing the extra params from the snippet config.
     *
     * @remarks This object keeps manually the desired snippet config properties to avoid
     * unnecessary re-renders.
     *
     * @internal
     */
    protected extraParams: Dictionary<unknown> = {};

    /**
     * Collection of properties from the snippet config to exclude from the
     * extra params object.
     *
     * @public
     */
    @Prop({
      default: (): Array<keyof SnippetConfig> => [
        'callbacks',
        'productId',
        'uiLang',
        'consent',
        'documentDirection',
        'currency',
        'filters',
        'isSpa',
        'queriesPreview'
      ]
    })
    protected excludedExtraParams!: Array<keyof SnippetConfig>;

    /**
     * Updates the extraParams object when the snippet config changes.
     *
     * @param snippetConfig - The new snippet config.
     *
     * @internal
     */
    @Watch('snippetConfig', { deep: true, immediate: true })
    syncExtraParams(snippetConfig: SnippetConfig): void {
      forEach({ ...this.values, ...snippetConfig }, (name, value) => {
        if (!this.excludedExtraParams.includes(name)) {
          this.$set(this.extraParams, name, value);
        }
      });
    }
  }
</script>

<docs lang="mdx">
## See it in action

_See how the snippet config is injected and passed to the SnippetConfigExtraParams component._

```vue
<template>
  <Provider>
    <SnippetConfigExtraParams />
  </Provider>
</template>

<script>
  import { SnippetConfigExtraParams } from '@empathyco/x-components/extra-params';

  const Provider = {
    provide: {
      snippetConfig: {
        instance: 'demo',
        lang: 'es',
        warehouse: 1234
      }
    }
  };

  export default {
    name: 'SnippetConfigExtraParamsDemo',
    components: {
      Provider,
      SnippetConfigExtraParams
    }
  };
</script>
```
</docs>
