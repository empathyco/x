<template>
  <GlobalEvents target="window" @pageshow="onPageShow" @popstate="emitEvents" />
</template>

<script lang="ts">
import type { Dictionary } from '@empathyco/x-utils'
import type { FeatureLocation } from '../../../types/origin'
import type { UrlParams } from '../../../types/url-params'
import type { WireMetadata } from '../../../wiring/wiring.types'
import type { SnippetConfig } from '../../../x-installer/api/api.types'
import type { UrlParamValue } from '../store/types'
import { objectFilter } from '@empathyco/x-utils'
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import { GlobalEvents } from 'vue-global-events'
import { use$x } from '../../../composables/use-$x'
import { useState } from '../../../composables/use-state'
import { isArrayEmpty } from '../../../utils/array'
import { initialUrlState } from '../store/initial-state'
import { urlXModule } from '../x-module'

interface ParsedUrlParams {
  all: UrlParams
  extra: Dictionary<unknown>
}

/**
 * This component manages the browser URL parameters to preserve them through reloads and browser
 * history navigation. It allow to configure the default url parameter names using its attributes.
 * This component doesn't render elements to the DOM.
 *
 * @public
 */
export default defineComponent({
  name: 'UrlHandler',
  components: {
    GlobalEvents,
  },
  xModule: urlXModule.name,
  inheritAttrs: false,
  setup(_, { attrs }) {
    const $x = use$x()

    const { initialExtraParams } = useState('url')

    /**
     * The {@link SnippetConfig} provided by an ancestor.
     *
     * @internal
     */
    const snippetConfig = inject<SnippetConfig | undefined>('snippetConfig')

    /**
     * Flag to know if the params were already loaded from the URL.
     *
     * @internal
     */
    const urlLoaded = ref(false)

    /**
     * The page URL. It is used to compare against the current URL to check navigation state.
     *
     * @internal
     */
    const url = ref<URL | undefined>(undefined)

    /**
     * Flag to know if the page has been persisted by the browser's back-forward cache.
     *
     * @internal
     */
    const isPagePersisted = ref(false)

    /**
     * Computed to know which params we must get from URL. It gets the params names from the initial
     * state, to get all default params names, and also from the `$attrs` to get the extra params
     * names to take into account.
     *
     * @returns An array with the name of the params.
     *
     * @internal
     */
    const managedParamsNames = computed(() => Object.keys({ ...initialUrlState, ...attrs }))

    /**
     * Returns the mapping of the param keys used in the URL is configured through $attrs. This way
     * we can support any param and extra param, no matters its name.
     *
     * @param paramName - The param name to get the Url key.
     * @returns The key used in the URL for the `paramName` passed.
     *
     * @internal
     */
    const getUrlKey = (paramName: string) => {
      const paramValue = attrs[paramName]
      return typeof paramValue === 'string' ? paramValue : paramName
    }

    /**
     * Deletes all the parameters in the passed URL.
     *
     * @param url - The URL to remove parameters from.
     * @internal
     */
    const deleteUrlParameters = (url: URL) => {
      managedParamsNames.value.forEach(paramName => url.searchParams.delete(getUrlKey(paramName)))
    }

    /**
     * Sorts the params in a tuple array [key,value] to generate always the same URL with the params
     * in the same order.
     *
     * @param urlParams - The {@link UrlParams} to sort.
     * @returns An array of tuples with the key-value of each paramter, sorted by key.
     * @internal
     */
    const sortParams = (urlParams: UrlParams): Array<[string, unknown]> => {
      return Object.entries(urlParams).sort(([param1], [param2]) => {
        return param1 < param2 ? -1 : 1
      })
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
     */
    const setUrlParameters = (url: URL, urlParams: UrlParams): void => {
      // Only when there is a query the rest of the parameters are valid.
      if (!urlParams.query) {
        return
      }
      const filteredParams = objectFilter(urlParams, paramName =>
        managedParamsNames.value.includes(paramName as string),
      )
      const sortedParameters = sortParams(filteredParams)
      sortedParameters.forEach(([paramName, paramValue]) => {
        const urlParamKey = getUrlKey(paramName)
        if (Array.isArray(paramValue)) {
          paramValue.forEach(value => {
            url.searchParams.append(urlParamKey, String(value))
          })
        } else {
          url.searchParams.set(urlParamKey, String(paramValue))
        }
      })
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
    const updateUrl = (
      newUrlParams: UrlParams,
      historyMethod: History['pushState'] | History['replaceState'],
    ): void => {
      if (urlLoaded.value) {
        const newUrl = new URL(window.location.href)
        deleteUrlParameters(newUrl)
        setUrlParameters(newUrl, newUrlParams)

        // Normalize '+' characters into '%20' for spaces in url params.
        newUrl.search = newUrl.search.replace(/\+/g, '%20')

        if (newUrl.href !== window.location.href) {
          historyMethod({ ...window.history.state }, document.title, newUrl.href)
        }
        url.value = newUrl
      }
    }

    /**
     * Updates the browser URL with the new {@link UrlParams} using the history `pushState` method.
     *
     * @param newUrlParams - The new params to update browser URL.
     */
    $x.on('PushableUrlStateUpdated', false).subscribe((newUrlParams: UrlParams) => {
      updateUrl(newUrlParams, window.history.pushState.bind(window.history))
    })

    /**
     * Updates the browser URL with the new {@link UrlParams} using the history `replaceState`
     * method.
     *
     * @param newUrlParams - The new params to update browser URL.
     */
    $x.on('ReplaceableUrlStateUpdated', false).subscribe((newUrlParams: UrlParams) => {
      updateUrl(newUrlParams, window.history.replaceState.bind(window.history))
    })

    /**
     * Handler of the
     * [pageshow](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event)
     * event.
     *
     * @remarks The pageshow event is listened to check if the browser has performed a navigation
     * using the back-forward cache. This information is available in the
     * PageTransitionEvent.persisted property.
     *
     * @param event - The page transition event.
     * @internal
     */
    const onPageShow = (event: PageTransitionEvent) => {
      isPagePersisted.value = event.persisted
      if (event.persisted) {
        // The internal url is reset due to the back-forward cache storing the previous value which
        // is no longer valid.
        url.value = undefined
      }
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
    const parseUrlParam = (name: string, value: string[]): UrlParamValue => {
      switch (typeof initialUrlState[name]) {
        case 'number':
          return Number(value[0])
        case 'boolean':
          return value[0].toLowerCase() === 'true'
        case 'string':
          return value[0]
        default:
          // array
          return value
      }
    }

    /**
     * Gets the {@link UrlParams} from the URL, including only the params defined by `paramsNames`.
     *
     * @returns ParsedUrlParams obtained from URL.
     * @internal
     */
    const parseUrlParams = (): ParsedUrlParams => {
      const urlSearchParams = new URL(window.location.href).searchParams
      return managedParamsNames.value.reduce<ParsedUrlParams>(
        (params, name) => {
          const urlKey = getUrlKey(name)
          if (urlSearchParams.has(urlKey)) {
            if (name in initialUrlState) {
              const urlValue = urlSearchParams.getAll(urlKey)
              params.all[name] = parseUrlParam(name, urlValue)
            } else {
              params.all[name] = params.extra[name] = urlSearchParams.get(urlKey)
            }
          }
          return params
        },
        { all: { ...initialUrlState }, extra: { ...initialExtraParams.value } },
      )
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
    const isNavigatingFromPdp = (): boolean => {
      const isPagePersistedValue = isPagePersisted.value
      const navigationEntries = window.performance.getEntriesByType('navigation')
      const navigationType = (navigationEntries[0] as PerformanceNavigationTiming)?.type
      const useFallbackStrategy =
        !navigationEntries.length &&
        (isArrayEmpty(navigationEntries) || navigationType === 'reload')

      // Reset internal isPagePersisted property value
      isPagePersisted.value = false

      if (useFallbackStrategy) {
        const isNavigatingInSpa = !!snippetConfig?.isSpa && navigationType === 'navigate'
        return navigationType === 'back_forward' || isNavigatingInSpa || isPagePersistedValue
      } else {
        const isNavigatingInSpa = !!snippetConfig?.isSpa && navigationType === 'navigate'
        return navigationType === 'back_forward' || isNavigatingInSpa || isPagePersistedValue
      }
    }

    /**
     * Detects the {@link FeatureLocation} used to build the
     * {@link QueryOriginInit} data.
     *
     * @returns The {@link FeatureLocation}.
     * @internal
     */
    const detectLocation = (): FeatureLocation => {
      const currentUrl = new URL(window.location.href)
      const previousUrl = url.value
      url.value = currentUrl

      const isInternalNavigation =
        previousUrl?.search !== currentUrl.search && previousUrl?.pathname === currentUrl.pathname
      if (isInternalNavigation) {
        return 'url_history'
      }

      if (isNavigatingFromPdp()) {
        return 'url_history_pdp'
      }

      return 'external'
    }

    /**
     * Creates the wire metadata to include in every emitted {@link XEvent}.
     *
     * @returns The {@link WireMetadata}.
     * @internal
     */
    const createWireMetadata = (): Pick<WireMetadata, 'feature' | 'location'> => {
      return {
        feature: 'url',
        location: detectLocation(),
      }
    }

    /**
     * Emits the {@link UrlXEvents.ParamsLoadedFromUrl} XEvent,
     * the {@link UrlXEvents.ExtraParamsLoadedFromUrl} XEvent and, if there is query, also emits
     * the {@link XEventsTypes.UserOpenXProgrammatically}.
     *
     * @internal
     */
    const emitEvents = () => {
      const { all, extra } = parseUrlParams()
      const metadata = createWireMetadata()
      $x.emit('ParamsLoadedFromUrl', all, metadata)
      $x.emit('ExtraParamsLoadedFromUrl', extra, metadata)
      if (all.query) {
        $x.emit('UserOpenXProgrammatically', undefined, metadata)
      }
      urlLoaded.value = true
    }

    /**
     * To emit the Url events just when the URL is load, and before the components mounted events
     * and state changes, we do it in the created of this component.
     */
    onMounted(() => {
      emitEvents()
    })

    return {
      onPageShow,
      emitEvents,
    }
  },
})
</script>

<docs lang="mdx">
## Events

This component emits the following events:

- [`ParamsLoadedFromUrl`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`ExtraParamsLoadedFromUrl`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)
- [`UserOpenXProgrammatically`](https://github.com/empathyco/x/blob/main/packages/x-components/src/wiring/events.types.ts)

## See it in action

This component manages the browser URL parameters to preserve them through reloads and browser
history navigation. It allows you to configure the default URL parameter names using its attributes. This
component doesn't render elements to the DOM.

_Try to make some requests and take a look at the URL!_

```vue
<template>
  <UrlHandler />
</template>

<script setup>
import { UrlHandler } from '@empathyco/x-components/url-handler'
</script>
```

### Play with props

In this example, the `UrlHandler` component changes the following query parameter names:

- `query` to be `q`.
- `page` to be `p`.
- `filter` to be `f`.
- `sort` to be `s`.

_Try to make some requests and take a look at the URL!_

```vue
<template>
  <UrlHandler query="q" page="p" filter="f" sort="s" />
</template>

<script setup>
import { UrlHandler } from '@empathyco/x-components/url-handler'
</script>
```

### Play with events

The `UrlHandler` will emit the `ParamsLoadedFromUrl` when the page is loaded.

The `UrlHandler` will emit the `ExtraParamsLoadedFromUrl` when the page is loaded with an extra
param configured and with a value in the URL.

The `UrlHandler` will emit the `UserOpenXProgrammatically` when the page is loaded with a query in
the URL.
</docs>
