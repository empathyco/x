<template>
  <GlobalEvents @pageshow="onPageShow" @popstate="emitEvents" target="window" />
</template>

<script lang="ts">
  import { objectFilter } from '@empathyco/x-utils';
  import Vue from 'vue';
  import GlobalEvents from 'vue-global-events';
  import { Component, Inject } from 'vue-property-decorator';
  import { State } from '../../../components';
  import { XOn } from '../../../components/decorators/bus.decorators';
  import { xComponentMixin } from '../../../components/x-component.mixin';
  import { FeatureLocation } from '../../../types/origin';
  import { UrlParams } from '../../../types/url-params';
  import { isArrayEmpty } from '../../../utils/array';
  import { Dictionary } from '../../../utils/types';
  import { WireMetadata } from '../../../wiring/wiring.types';
  import { SnippetConfig } from '../../../x-installer/api/api.types';
  import { initialUrlState } from '../store/initial-state';
  import { UrlParamValue } from '../store/types';
  import { urlXModule } from '../x-module';

  interface ParsedUrlParams {
    all: UrlParams;
    extra: Dictionary<unknown>;
  }

  /**
   * This component manage the browser URL parameters to perserve them through reloads and browser
   * history navigation. It allow to configure the default url parameter names using its attributes.
   * This component doesn't render elements to the DOM.
   *
   * @public
   */
  @Component({
    components: {
      GlobalEvents
    },
    mixins: [xComponentMixin(urlXModule)]
  })
  export default class UrlHandler extends Vue {
    /**
     * The {@link SnippetConfig} provided by an ancestor.
     *
     * @internal
     */
    @Inject({ default: undefined })
    protected snippetConfig?: SnippetConfig;

    /**
     * Flag to know if the params were already loaded from the URL.
     *
     * @internal
     */
    protected urlLoaded = false;

    /**
     * The page URL. It is used to compare against the current URL to check navigation state.
     *
     * @internal
     */
    protected url?: URL;

    /**
     * Flag to know if the page has been persisted by the browser's back-forward cache.
     *
     * @internal
     */
    protected isPagePersisted = false;

    /**
     * Computed to know which params we must get from URL. It gets the params names from the initial
     * state, to get all default params names, and also from the `$attrs` to get the extra params
     * names to take into account.
     *
     * @returns An array with the name of the params.
     *
     * @internal
     */
    protected get managedParamsNames(): string[] {
      return Object.keys({ ...initialUrlState, ...this.$attrs });
    }

    @State('url', 'initialExtraParams')
    public initialExtraParams!: Dictionary<unknown>;

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
     * To emit the Url events just when the URL is load, and before the components mounted events
     * and state changes, we do it in the created of this component.
     */
    created(): void {
      this.emitEvents();
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
     * Handler of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event | pageshow }
     * event.
     *
     * @remarks The pageshow event is listened to check if the browser has performed a navigation
     * using the back-forward cache. This information is available in the
     * PageTransitionEvent.persisted property.
     *
     * @param event - The page transition event.
     * @internal
     */
    protected onPageShow(event: PageTransitionEvent): void {
      this.isPagePersisted = event.persisted;
      if (event.persisted) {
        // The internal url is reset due to the back-forward cache storing the previous value which
        // is no longer valid.
        this.url = undefined;
      }
    }

    /**
     * Emits the {@link UrlXEvents.ParamsLoadedFromUrl} XEvent,
     * the {@link UrlXEvents.ExtraParamsLoadedFromUrl} XEvent and, if there is query, also emits
     * the {@link XEventsTypes.UserOpenXProgrammatically}.
     *
     * @internal
     */
    protected emitEvents(): void {
      const { all, extra } = this.parseUrlParams();
      const metadata = this.createWireMetadata();
      this.$x.emit('ParamsLoadedFromUrl', all, metadata);
      this.$x.emit('ExtraParamsLoadedFromUrl', extra, metadata);
      // TODO: Move this logic from here.
      if (all.query) {
        this.$x.emit('UserOpenXProgrammatically', undefined, metadata);
      }
      this.urlLoaded = true;
    }

    /**
     * Creates the wire metadata to include in every emitted {@link XEvent | XEvents}.
     *
     * @returns The {@link WireMetadata | metadata}.
     * @internal
     */
    protected createWireMetadata(): Pick<WireMetadata, 'feature' | 'location'> {
      return {
        feature: 'url',
        location: this.detectLocation()
      };
    }

    /**
     * Detects the {@link FeatureLocation | location} used to build the
     * {@link QueryOriginInit | events metadata origin}.
     *
     * @returns The {@link FeatureLocation | location}.
     * @internal
     */
    protected detectLocation(): FeatureLocation {
      const currentUrl = new URL(window.location.href);
      const previousUrl = this.url;
      this.url = currentUrl;

      const isInternalNavigation =
        previousUrl?.search !== currentUrl.search && previousUrl?.pathname === currentUrl.pathname;
      if (isInternalNavigation) {
        return 'url_history';
      }

      if (this.isNavigatingFromPdp()) {
        return 'url_history_pdp';
      }

      return 'external';
    }

    /**
     * Check if the navigation is from a product page.
     *
     * @remarks Due to Safari 14 not supporting the new and standard PerformanceNavigationTiming
     * API, we are falling back to the deprecated one, PerformanceNavigation. We also fallback to
     * this API whenever we get a navigationType equal to reload, because Safari has a bug that the
     * navigationType is permanently set to reload after you have reload the page and it never
     * resets. As some browsers have a back-forward cache implemented, we also take into account if
     * the page is persisted.
     *
     * @returns True if the navigation is from a product page, false otherwise.
     * @internal
     */
    protected isNavigatingFromPdp(): boolean {
      const isPagePersisted = this.isPagePersisted;
      const navigationEntries = window.performance.getEntriesByType('navigation');
      const navigationType = (navigationEntries[0] as PerformanceNavigationTiming)?.type;
      const useFallbackStrategy =
        window.performance.navigation &&
        (isArrayEmpty(navigationEntries) || navigationType === 'reload');

      // Reset internal isPagePersisted property value
      this.isPagePersisted = false;

      if (useFallbackStrategy) {
        const {
          type: fallbackNavigationType,
          TYPE_BACK_FORWARD,
          TYPE_NAVIGATE
        } = window.performance.navigation;
        const isNavigatingInSpa =
          !!this.snippetConfig?.isSpa && fallbackNavigationType === TYPE_NAVIGATE;
        return fallbackNavigationType === TYPE_BACK_FORWARD || isNavigatingInSpa || isPagePersisted;
      } else {
        const isNavigatingInSpa = !!this.snippetConfig?.isSpa && navigationType === 'navigate';
        return navigationType === 'back_forward' || isNavigatingInSpa || isPagePersisted;
      }
    }

    /**
     * Gets the {@link UrlParams} from the URL, including only the params defined by `paramsNames`.
     *
     * @returns ParsedUrlParams obtained from URL.
     * @internal
     */
    protected parseUrlParams(): ParsedUrlParams {
      const urlSearchParams = new URL(window.location.href).searchParams;
      return this.managedParamsNames.reduce<ParsedUrlParams>(
        (params, name) => {
          const urlKey = this.getUrlKey(name);
          if (urlSearchParams.has(urlKey)) {
            if (name in initialUrlState) {
              const urlValue = urlSearchParams.getAll(urlKey);
              params.all[name] = this.parseUrlParam(name, urlValue);
            } else {
              params.all[name] = params.extra[name] = urlSearchParams.get(urlKey);
            }
          }
          return params;
        },
        { all: { ...initialUrlState }, extra: { ...this.initialExtraParams } }
      );
    }

    /**
     * Updates the browser URL with the passed `newUrlParams` and using the browser history method
     * passed as `historyMethod`. It only updates the browser history if the new URL is different
     * from the current.
     *
     * @param newUrlParams - The new params to add to the browser URL.
     * @param historyMethod - The browser history method used to add the new URL.
     *
     * @internal
     */
    protected updateUrl(
      newUrlParams: UrlParams,
      historyMethod: History['pushState'] | History['replaceState']
    ): void {
      if (this.urlLoaded) {
        const url = new URL(window.location.href);
        this.deleteUrlParameters(url);
        this.setUrlParameters(url, newUrlParams);
        if (url.href.replace(/\+/g, '%20') !== window.location.href) {
          historyMethod({ ...window.history.state }, document.title, url.href);
        }
        this.url = url;
      }
    }

    /**
     * Deletes all the parameters in the passed URL.
     *
     * @param url - The URL to remove parameters from.
     * @internal
     * **/
    protected deleteUrlParameters(url: URL): void {
      this.managedParamsNames.forEach(paramName =>
        url.searchParams.delete(this.getUrlKey(paramName))
      );
    }

    /**
     * Set all the provided parameters to the url with the mapped key.
     *
     * @param url - The current URL.
     * @param urlParams - The list of parameters to add.
     * @remarks The params are filtered because there maybe received extra params which will not be
     * managed by URL. This is defined by the `managedParamsNames` computed. Also, the parameters
     * are sorted Alphabetically to produce always the same URL with the same parameters.This is
     * important for SEO purposes.
     *
     * @internal
     * **/
    protected setUrlParameters(url: URL, urlParams: UrlParams): void {
      const filteredParams = objectFilter(urlParams, paramName =>
        this.managedParamsNames.includes(paramName as string)
      );
      const sortedParameters = this.sortParams(filteredParams);
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
     * @param name - The name of the param in {@link UrlParams}.
     * @param value - The `URLSearchParams` value as an arry of strings.
     * @returns The parsed value.
     *
     * @internal
     */
    protected parseUrlParam(name: string, value: string[]): UrlParamValue {
      switch (typeof initialUrlState[name]) {
        case 'number':
          return Number(value[0]);
        case 'boolean':
          return value[0].toLowerCase() === 'true';
        case 'string':
          return value[0];
        default:
          // array
          return value;
      }
    }
  }
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`ParamsLoadedFromUrl`](./../../api/x-components.urlxevents.paramsloadedfromurl.md)
- [`ExtraParamsLoadedFromUrl`](./../../api/x-components.urlxevents.extraparamsloadedfromurl.md)
- [`UserOpenXProgrammatically`](./../../api/x-components.xeventstypes.useropenxprogrammatically.md)

## See it in action

This component manages the browser URL parameters to preserve them through reloads and browser
history navigation. It allow to configure the default url parameter names using its attributes. This
component doesn't render elements to the DOM.

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

- `query` to be `q`.
- `page` to be `p`.
- `filter` to be `f`
- `sort` to be `s`

_Try to make some requests and take a look to the url!_

```vue
<template>
  <UrlHandler query="q" page="p" filter="f" sort="s" />
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

The `UrlHandler` will emit the `ExtraParamsLoadedFromUrl` when the page is loaded with an extra
param configured and with a value in URL.

The `UrlHandler` will emit the `UserOpenXProgrammatically` when the page is loaded with a query in
the URL.
</docs>
