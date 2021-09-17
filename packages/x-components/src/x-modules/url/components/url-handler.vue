<script lang="ts">
  import { RelatedTag } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { XOn } from '../../../components';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { Dictionary, reduce } from '../../../utils';
  import { UrlConfig } from '../config.types';
  import { Params, UrlParamValue } from '../store';
  import { urlXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(urlXModule)]
  })
  export default class UrlHandler extends Vue {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}

    /**
     * Saves the new parameter names, if present, and add two XEvents to the
     * (`onload` and `onpopstate`) listeners of the browser window.
     *
     * @internal
     */
    mounted(): void {
      this.saveUrlConfig();

      window.addEventListener('load', () => {
        this.$x.emit('DocumentLoaded');
      });

      window.addEventListener('popstate', () => {
        this.$x.emit('DocumentHistoryChanged');
      });
    }

    @XOn('UrlStateChanged')
    syncUrlState(params: Dictionary<UrlParamValue>): void {
      if (Object.keys(params).length) {
        const { query, relatedTags } = params;

        if (relatedTags) {
          this.$x.emit(
            'RelatedTagsChanged',
            (relatedTags as string[]).reduce<RelatedTag[]>((acc, relatedTag) => {
              acc.push(this.generateRelatedTag(relatedTag, query as string));
              return acc;
            }, [])
          );
        }
      }
    }

    /**
     * Generates a {@link @empathyco/x-types#RelatedTag | related tags} entity from a tag and
     * a query.
     *
     * @param relatedTag - The tag from the url.
     * @param query - The query from the url.
     *
     * @returns A {@link @empathyco/x-types#RelatedTag | related tag}.
     */
    protected generateRelatedTag(relatedTag: string, query: string): RelatedTag {
      return {
        tag: `${relatedTag} ${query}`,
        modelName: 'RelatedTag',
        selected: true,
        query,
        previous: ''
      };
    }

    /**
     * If present, save the url parameters names in the store passed as prop and read as attrs.
     *
     * @internal
     */
    private saveUrlConfig(): void {
      if (Object.keys(this.$attrs).length > 0) {
        const params = reduce(
          this.$attrs,
          (acc, key, value) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<keyof UrlConfig['urlParamNames'], string>
        );

        this.$x.emit('UrlConfigProvided', {
          urlParamNames: {
            ...params
          }
        });
      }
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`UrlConfigProvided`](./../../api/x-components.urlxevents.urlconfigprovided.md)
- [`DocumentLoaded`](./../../api/x-components.urlxevents.documentloaded.md)
- [`DocumentHistoryChanged`](./../../api/x-components.urlxevents.documenthistorychanged.md)

## See it in action

This component doesn't render elements to the DOM, but serves as a way to easily change the default
url parameter names.

_Try to make some requests and take a look to the url!_

```vue
<template>
  <UrlHandler />
</template>

<script>
  import { UrlHandler } from '@empathyco/x-components/url-handler';

  export default {
    name: 'UrlHandlerDemo',
    components: {
      UrlHandler
    }
  };
</script>
```

### Play with props

In this example, the `UrlHandler` component changes the following query parameter names:

- `query` to be `ebq`.
- `page` to be `p`.
- `filters` to be `f`
- `sort` to be `s`

_Try to make some requests and take a look to the url!_

```vue
<template>
  <UrlHandler :query="query" :page="page" :filters="filters" :sort="sort" />
</template>

<script>
  import { UrlHandler } from '@empathyco/x-components/url-handler';

  export default {
    name: 'UrlHandlerDemo',
    components: {
      UrlHandler
    },
    data() {
      return {
        query: 'ebq',
        page: 'p',
        filters: 'f',
        sort: 's'
      };
    }
  };
</script>
```

### Play with events

The `UrlHandler` will emit a `UrlConfigProvided` event, with the new url param names if they are
provided.

It also emits the `DocumentLoaded` when the page is loaded and the `DocumentHistoryChanged` when the
url changes.
</docs>
