import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { Store } from 'vuex'
import { getResultsStub } from '../../../../__stubs__'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { BaseResultLink, getXComponentXModuleName, isXComponent } from '../../../../components'
import { identifierResultsXModule } from '../../x-module'
import IdentifierResult from '../identifier-result.vue'
import IdentifierResults from '../identifier-results.vue'
import { resetStoreIdentifierResultState } from './utils'

async function render(
  template = '<IdentifierResults :animation="animation" :maxItemsToRender="maxItemsToRender"/>',
  components = { IdentifierResults } as any,
) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const identifierResultsStub = getResultsStub()
  const wrapper = mount(
    { template, components, props: ['animation', 'maxItemsToRender'] },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [identifierResultsXModule] })],
      },
    },
  )

  resetStoreIdentifierResultState(store, {
    query: 'A02232',
    identifierResults: identifierResultsStub,
  })
  await nextTick()

  return {
    wrapper,
    store,
    identifierResultsStub,
    identifierResultsWrapper: wrapper.findComponent(IdentifierResults),
  }
}

describe('testing IdentifierResult component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { identifierResultsWrapper } = await render()

    expect(isXComponent(identifierResultsWrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(identifierResultsWrapper.vm)).toEqual('identifierResults')
  })

  it('renders a list of IdentifierResult wrapped by a BaseResultLink', async () => {
    const { wrapper, identifierResultsStub } = await render(
      `
      <IdentifierResults>
        <template #default="{ identifierResult }">
          <BaseResultLink :result="identifierResult">
            <template #default="{ result }">
              <IdentifierResult :result="result" />
            </template>
          </BaseResultLink>
        </template>
      </IdentifierResults>`,
      { BaseResultLink, IdentifierResult, IdentifierResults },
    )

    expect(wrapper.findComponent(BaseResultLink)).toBeDefined()

    const spanList = wrapper.findAll(getDataTestSelector('identifier-result'))
    identifierResultsStub.forEach((result, index) =>
      expect(spanList.at(index)?.text()).toEqual(result.identifier!.value),
    )
  })

  it('does not render any IdentifierResult if the are none', async () => {
    const { store, wrapper } = await render()

    resetStoreIdentifierResultState(store)
    await nextTick()

    expect(wrapper.isVisible()).toEqual(false)
  })

  it('allows changing the animation with a transition group', async () => {
    const animation = defineComponent({
      setup: (_, { slots }) => slots.default?.() ?? '',
      template: `<transition-group data-test="test-animation"><slot /></transition-group>`,
    })
    const { wrapper } = await render()

    await wrapper.setProps({ animation })

    expect(wrapper.findComponent(animation).exists()).toEqual(true)
    expect(wrapper.find(getDataTestSelector('test-animation')).exists()).toEqual(true)
  })

  it('renders at most the number of identifier results defined by `maxItemsToRender` prop', async () => {
    const { wrapper, identifierResultsStub } = await render()
    const renderedResults = () => wrapper.findAll(getDataTestSelector('identifier-results-item'))

    expect(renderedResults()).toHaveLength(identifierResultsStub.length)

    await wrapper.setProps({ maxItemsToRender: identifierResultsStub.length - 1 })
    expect(renderedResults()).toHaveLength(identifierResultsStub.length - 1)

    await wrapper.setProps({ maxItemsToRender: identifierResultsStub.length })
    expect(renderedResults()).toHaveLength(identifierResultsStub.length)

    await wrapper.setProps({ maxItemsToRender: identifierResultsStub.length + 1 })
    expect(renderedResults()).toHaveLength(identifierResultsStub.length)
  })
})
