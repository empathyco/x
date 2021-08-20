<template>
  <ExtraParams :values="extraParams" />
</template>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Watch } from 'vue-property-decorator';
  import { xComponentMixin, XInject } from '../../../components';
  import { Dictionary, forEach } from '../../../utils';
  import { SnippetConfig } from '../../../x-installer';
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
    @XInject('snippetConfig')
    public snippetConfig!: SnippetConfig;

    /**
     * Custom object containing the extra params from the snippet config.
     *
     * @remarks This object keeps manually the desired snippet config properties to avoid
     * unnecessary re-renders.
     */
    public extraParams: Dictionary<unknown> = {};

    /**
     * Updates the extraParams object when the snippet config changes.
     *
     * @param snippetConfig - The new snippet config.
     *
     * @internal
     */
    @Watch('snippetConfig', { deep: true, immediate: true })
    syncExtraParams({
      instance,
      env,
      scope,
      lang,
      searchLang,
      consent,
      documentDirection,
      currency,
      ...snippetExtraParams
    }: SnippetConfig): void {
      forEach(snippetExtraParams, (name, value) => {
        this.$set(this.extraParams, name, value);
      });
    }
  }
</script>

<docs lang="mdx">
## See it in action

_See how the snippet config is injected and passed to the ExtraParams component._

```vue
<template>
  <Provider>
    <SnippetConfigExtraParams />
  </Provider>
</template>

<script>
  import { SnippetConfigExtraParams } from '@empathyco/x-components/snippet-config-extra-params';

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
