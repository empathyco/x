<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { Getter } from '../../../components/decorators/store.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { Dictionary, reduce } from '../../../utils';
  import { UrlConfig } from '../config.types';
  import { UrlParamValue } from '../store/types';
  import { urlXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(urlXModule)]
  })
  export default class UrlHandler extends Vue {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}

    @Getter('url', 'urlParams')
    public urlParams!: Dictionary<UrlParamValue>;

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
        this.emitEvents();
      });

      window.addEventListener('popstate', () => {
        this.$x.emit('DocumentHistoryChanged');
        this.emitEvents();
      });
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

    /**
     * Emits the event with the state values when the document is loaded and open X if there is
     * a query in the Url.
     *
     * @internal
     */
    protected emitEvents(): void {
      if (Object.entries(this.urlParams).length) {
        this.$x.emit('ParamsLoadedFromUrl', this.urlParams);
        if (this.urlParams['query']) {
          this.$x.emit('UserOpenXProgrammatically');
        }
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
- [`ParamsLoadedFromUrl`](./../../api/x-components.urlxevents.paramsloadedfromurl.md)
- [`UserOpenXProgrammatically`](./../../api/x-components.xeventstypes.useropenxprotrammaticaaly.md)

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
