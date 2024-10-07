<template>
  <ExtraParams :values="extraParams" />
</template>

<script lang="ts">
  import { forEach, Dictionary } from '@empathyco/x-utils';
  import { defineComponent, inject, PropType, ref, watch } from 'vue';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { extraParamsXModule } from '../x-module';
  import ExtraParams from './extra-params.vue';

  export default defineComponent({
    name: 'SnippetConfigExtraParams',
    xModule: extraParamsXModule.name,
    components: {
      ExtraParams
    },
    props: {
      values: {
        type: Object as PropType<Dictionary<unknown>>
      },
      excludedExtraParams: {
        type: Array as PropType<Array<keyof SnippetConfig>>,
        default: (): Array<keyof SnippetConfig> => [
          'callbacks',
          'productId',
          'uiLang',
          'consent',
          'documentDirection',
          'filters',
          'isSpa',
          'queriesPreview'
        ]
      }
    },
    setup(props) {
      const snippetConfig = inject('snippetConfig') as SnippetConfig;
      const extraParams = ref<Record<string, any>>({});

      watch(
        [() => snippetConfig, () => props.values],
        () => {
          forEach({ ...props.values, ...snippetConfig }, (name, value) => {
            if (!props.excludedExtraParams.includes(name) && extraParams.value[name] !== value) {
              extraParams.value = { ...extraParams.value, [name]: value };
            }
          });
        },
        {
          deep: true,
          immediate: true
        }
      );

      return {
        extraParams
      };
    }
  });
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
