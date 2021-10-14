<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { UrlParams } from '../../../types/url-params';
  import { cleanUndefined } from '../../../utils/object';
  import { initialUrlState } from '../store/initial-state';
  import { UrlParamValue } from '../store/types';
  import { urlXModule } from '../x-module';

  @Component({
    mixins: [xComponentMixin(urlXModule)]
  })
  export default class UrlHandler extends Vue {
    /**
     * Computed to know which params we must to get from URL. It gets the params names from the
     * initial state, to get all default params names, and also from the `$attrs` to get the extra
     * params names to take into account.
     *
     * @returns An array with the name of the params.
     *
     * @internal
     */
    protected get paramsNames(): string[] {
      return Object.keys({ ...initialUrlState.params, ...this.$attrs });
    }

    /**
     * Returns the mapping of the param keys used in the URL is configured through $attrs. This way
     * we can support any param and extra param, no matters its name.
     *
     * @param paramName - The param name to get the Url key.
     * @returns The key used in the URL for the `paramName` passed.
     *
     * @internal
     */
    protected getUrlKey(paramName: string): string {
      return this.$attrs[paramName] ?? paramName;
    }

    /**
     * Add listeners to emit XEvents to the `onload` and `onpopstate` events of the browser window.
     *
     * @internal
     */
    mounted(): void {
      window.addEventListener('load', this.emitEvents.bind(this));
      window.addEventListener('popstate', this.emitEvents.bind(this));
    }

    beforeDestroy(): void {
      window.removeEventListener('load', this.emitEvents.bind(this));
      window.removeEventListener('popstate', this.emitEvents.bind(this));
    }

    /**
     * Updates the browser URL with the new {@link UrlParams} using the history `pushState` method.
     *
     * @param newUrlParams - The new params to update browser URL.
     */
    @XOn('PushableUrlStateChanged')
    updateUrlWithPush(newUrlParams: UrlParams): void {
      this.updateUrl(newUrlParams, window.history.pushState.bind(window.history));
    }

    /**
     * Updates the browser URL with the new {@link UrlParams} using the history `replaceState`
     * method.
     *
     * @param newUrlParams - The new params to update browser URL.
     */
    @XOn('ReplaceableUrlStateChanged')
    updateUrlWithReplace(newUrlParams: UrlParams): void {
      this.updateUrl(newUrlParams, window.history.replaceState.bind(window.history));
    }

    /**
     * Emits the {@link XEventsTypes.ParamsLoadedFromUrl} XEvent and, if there is query, also emits
     * the  {@link XEventsTypes.UserOpenXProgrammatically}.
     *
     * @internal
     */
    protected emitEvents(): void {
      const urlParams = this.getUrlParams();
      this.$x.emit('ParamsLoadedFromUrl', urlParams);
      if (urlParams.query) {
        this.$x.emit('UserOpenXProgrammatically');
      }
    }

    /**
     * Gets the {@link UrlParams} from the URL, including only the params defined by
     * {@link paramsNames}.
     *
     * @returns UrlParams obtained from URL.
     * @internal
     */
    protected getUrlParams(): UrlParams {
      const urlSearchParams = new URL(window.location.href).searchParams;
      const urlParams = this.paramsNames.reduce((urlParams, paramName) => {
        urlParams[paramName] = this.getParamByType(urlSearchParams, paramName);
        return urlParams;
      }, {} as UrlParams);
      return Object.assign({}, initialUrlState.params, cleanUndefined(urlParams));
    }

    /**
     * Updates the browser URL with the passed `newUrlParams` and using the browser history method
     * passed as `historyMethod`. It only updates the browser history if the new URL is different
     * from the current.
     *
     * @param newUrlParams - The new params to add to the browser URL.
     * @param historyMethod - The browser history method used to add the new URL.
     */
    updateUrl(
      newUrlParams: UrlParams,
      historyMethod: History['pushState'] | History['replaceState']
    ): void {
      const url = new URL(window.location.href);
      this.deleteUrlParameters(url);
      this.setUrlParameters(url, newUrlParams);
      if (url.href !== window.location.href) {
        historyMethod({ ...window.history.state }, document.title, url.href);
      }
    }

    /**
     * Deletes all the parameters in the passed URL.
     *
     * @param url - The URL to remove parameters from.
     * @internal
     * **/
    protected deleteUrlParameters(url: URL): void {
      this.paramsNames.forEach(paramName => url.searchParams.delete(this.getUrlKey(paramName)));
    }

    /**
     * Set all the provided parameters to the url with the mapped key.
     *
     * @param url - The current URL.
     * @param urlParams - The list of parameters to add.
     * @internal
     * **/
    protected setUrlParameters(url: URL, urlParams: UrlParams): void {
      const sortedParameters = this.sortParams(urlParams);
      sortedParameters.forEach(([paramName, paramValue]) => {
        const urlParamKey = this.getUrlKey(paramName);
        if (Array.isArray(paramValue)) {
          paramValue.forEach(value => {
            url.searchParams.append(urlParamKey, String(value));
          });
        } else {
          url.searchParams.set(urlParamKey, String(paramValue));
        }
      });
    }

    /**
     * Sorts the params in a tuple array [key,value] to generate always the same URL with the params
     * in the same order.
     *
     * @param urlParams - The {@link UrlParams} to sort.
     * @returns An array of tuples with the key-value of each paramter, sorted by key.
     * @internal
     */
    protected sortParams(urlParams: UrlParams): Array<[string, unknown]> {
      return Object.entries(urlParams).sort(([param1], [param2]) => {
        return param1 < param2 ? -1 : 1;
      });
    }

    /**
     * Returns the URL param value parsed depending on its type in the initial store state. As we
     * can not know what type can have an extra param, all extra params are parsed as strings. We
     * know if it is an extra param because it is not in the initial state.
     *
     * @param urlSearchParams - The {@link URLSearchParams} to get the param.
     * @param paramName - The name of the param in {@link UrlParams}.
     * @returns The parsed value.
     *
     * @internal
     */
    protected getParamByType(
      urlSearchParams: URLSearchParams,
      paramName: string
    ): UrlParamValue | undefined {
      const key = this.getUrlKey(paramName);
      if (!(paramName in initialUrlState.params)) {
        return urlSearchParams.get(key) ?? undefined;
      } else {
        switch (typeof initialUrlState.params[paramName]) {
          case 'number': {
            const numberOrNull = urlSearchParams.get(key);
            return numberOrNull ? Number(numberOrNull) : undefined;
          }
          case 'boolean':
            return urlSearchParams.get(key)?.toLowerCase() === 'true';
          case 'string':
            return urlSearchParams.get(key) ?? undefined;
          default:
            // array
            return urlSearchParams.getAll(key);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    render(): void {}
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`ParamsLoadedFromUrl`](./../../api/x-components.urlxevents.paramsloadedfromurl.md)
- [`UserOpenXProgrammatically`](./../../api/x-components.xeventstypes.useropenxprogrammatically.md)

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
- `filter` to be `f`
- `sort` to be `s`

_Try to make some requests and take a look to the url!_

```vue
<template>
  <UrlHandler query="query" page="page" filter="filter" sort="sort" />
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

### Play with events

The `UrlHandler` will emit the `ParamsLoadedFromUrl` when the page is loaded.
</docs>
