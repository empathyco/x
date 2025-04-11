import type { DeepPartial, Dictionary } from '@empathyco/x-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store/index'
import type { QueryPreviewInfo } from '../../store/index'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { findTestDataById, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/index'
import { XPlugin } from '../../../../plugins/index'
import { queriesPreviewXModule } from '../../x-module'
import QueryPreviewButton from '../query-preview-button.vue'

function renderQueryPreviewButton({
  queryPreviewInfo = {
    query: 'milk',
    extraParams: { store: 'Magrathea' },
    filters: ['fit:regular'],
  },
  template = `<QueryPreviewButton v-bind="$attrs" />`,
}: RenderQueryPreviewButtonOptions = {}): RenderQueryPreviewButtonAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: { QueryPreviewButton },
      template,
    },
    {
      global: {
        plugins: [store, installNewXPlugin({ store })],
      },
      props: {
        queryPreviewInfo,
      },
    },
  )

  XPlugin.registerXModule(queriesPreviewXModule)
  const findTestDataByIdInButton = findTestDataById.bind(undefined, wrapper)

  const queryPreviewButtonEmitSpy = jest.fn()
  XPlugin.bus.on('UserAcceptedAQueryPreview').subscribe(queryPreviewButtonEmitSpy)

  return {
    wrapper: wrapper.findComponent(QueryPreviewButton),
    queryPreviewButtonEmitSpy,
    queryPreviewInfo,
    findTestDataById: findTestDataByIdInButton,
    updateExtraParams: async params => {
      store.commit('x/queriesPreview/setParams', params)
      await nextTick()
    },
  }
}

describe('query preview button', () => {
  jest.useFakeTimers()
  afterEach(() => {
    jest.runAllTimers()
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderQueryPreviewButton()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toBe('queriesPreview')
  })

  it('default slot with the query text of the query preview', () => {
    const { wrapper } = renderQueryPreviewButton()
    expect(wrapper.text()).toBe('milk')
  })

  it('can override the content of the slot', () => {
    const { findTestDataById } = renderQueryPreviewButton({
      template: `
        <QueryPreviewButton v-bind="$attrs">
          <template #default="{ queryPreviewInfo }">
            <span data-test="custom-content">{{ 'View more ' + queryPreviewInfo.query }}</span>
          </template>
        </QueryPreviewButton>
      `,
    })
    expect(findTestDataById('custom-content')).toBeTruthy()
  })

  it('sends the `UserAcceptedAQueryPreview` event when the button is clicked', async () => {
    const { queryPreviewButtonEmitSpy, updateExtraParams, wrapper } = renderQueryPreviewButton()
    const queryPreviewButton = wrapper.find('[data-test="query-preview-button"]')

    await queryPreviewButton.trigger('click')
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledTimes(1)
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledWith({
      query: 'milk',
      extraParams: {
        store: 'Magrathea',
      },
      filters: ['fit:regular'],
    })

    await updateExtraParams({ warehouse: 42 })

    await queryPreviewButton.trigger('click')
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledTimes(2)
    expect(queryPreviewButtonEmitSpy).toHaveBeenCalledWith({
      query: 'milk',
      extraParams: {
        store: 'Magrathea',
        warehouse: 42,
      },
      filters: ['fit:regular'],
    })
  })
})

interface RenderQueryPreviewButtonOptions {
  /** The query preview info to be used in the component. */
  queryPreviewInfo?: QueryPreviewInfo
  /** The template to be rendered. */
  template?: string
}

interface RenderQueryPreviewButtonAPI {
  /** The wrapper of the rendered component. */
  wrapper: VueWrapper
  /** The spy to check if the event was emitted. */
  queryPreviewButtonEmitSpy: jest.Mock
  /** The query preview info to be used in the component. */
  queryPreviewInfo: QueryPreviewInfo
  /** Updates the extra params of the query preview module. */
  updateExtraParams: (params: Dictionary<unknown>) => Promise<void>
  /** The function to find a data-test by its id. */
  findTestDataById: (id: string) => DOMWrapper<Element>[]
}
