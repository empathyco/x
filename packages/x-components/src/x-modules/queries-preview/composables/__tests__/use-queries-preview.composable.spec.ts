import type { DeepPartial } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { Store } from 'vuex'
import { createQueryPreviewItem } from '../../../../__stubs__/queries-preview-stubs.factory'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins'
import { resetXQueriesPreviewStateWith } from '../../components/__tests__/utils'
import { queriesPreviewXModule } from '../../x-module'
import { useQueriesPreview } from '../use-queries-preview.composable'

const store = new Store<DeepPartial<RootXStoreState>>({})

const renderUseQueriesPreview = (): RenderUseQueriesPreview => {
  const component = defineComponent({
    xModule: queriesPreviewXModule.name,
    template: '<div></div>',
  })

  const wrapper = mount(component, {
    global: { plugins: [installNewXPlugin({ store }), store] },
  })

  XPlugin.registerXModule(queriesPreviewXModule)

  return {
    store,
    wrapper,
  }
}

describe('queries preview composables', () => {
  beforeEach(() => {
    resetXQueriesPreviewStateWith(store)
  })

  describe('isAnyQueryLoadedInPreview', () => {
    const { store } = renderUseQueriesPreview()
    const { isAnyQueryLoadedInPreview } = useQueriesPreview()

    it('returns true if any query has results', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults: createQueryPreviewItem('queryWithResults'),
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: [],
          }),
        },
      })
      expect(isAnyQueryLoadedInPreview(['queryWithResults'])).toBe(true)
    })

    it('returns false if no query with results matches', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithResults: createQueryPreviewItem('queryWithResults'),
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: [],
          }),
        },
      })
      expect(isAnyQueryLoadedInPreview(['someQuery', 'anotherQuery'])).toBe(false)
    })

    it('returns false if the query is present but does not have results', () => {
      resetXQueriesPreviewStateWith(store, {
        queriesPreview: {
          queryWithNoResults: createQueryPreviewItem('queryWithNoResults', {
            totalResults: 0,
            results: [],
          }),
        },
      })
      expect(isAnyQueryLoadedInPreview(['queryWithNoResults'])).toBe(false)
    })
  })
})

interface RenderUseQueriesPreview {
  store: Store<DeepPartial<RootXStoreState>>
  wrapper: VueWrapper
}
