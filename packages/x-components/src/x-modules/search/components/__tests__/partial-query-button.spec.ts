import type { WireMetadata } from '../../../../wiring/wiring.types'
import { mount } from '@vue/test-utils'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/index'
import PartialQueryButton from '../partial-query-button.vue'

function renderPartialQueryButton({
  template = `<PartialQueryButton :query="query" />`,
  query = '',
}: RenderPartialQueryButtonOptions = {}) {
  const wrapper = mount(
    {
      components: {
        PartialQueryButton,
      },
      props: ['query'],
      template,
    },
    {
      props: {
        query,
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    },
  )

  const partialQueryButtonWrapper = wrapper.findComponent(PartialQueryButton)

  return {
    partialQueryButtonWrapper,
    click: async () => wrapper.trigger('click'),
  }
}

describe('testing PartialQueryButton component', () => {
  it('is an XComponent', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton()
    expect(isXComponent(partialQueryButtonWrapper.vm)).toEqual(true)
  })
  it('has Search as XModule', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton()
    expect(getXComponentXModuleName(partialQueryButtonWrapper.vm)).toEqual('search')
  })
  it('renders the default partial query', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton({
      query: 'lego',
    })

    expect(partialQueryButtonWrapper.find(getDataTestSelector('partial-query-button')).text()).toBe(
      'lego',
    )
  })
  it('renders a custom partial query', () => {
    const { partialQueryButtonWrapper } = renderPartialQueryButton({
      query: 'lego',
      template: `
      <PartialQueryButton :query="query" >
        <template #default="{ query }">
          <span data-test="partial-query-button__text" class="x-partial-query-button__text">
            Set this partial query {{ query }} as the new query.
          </span>
        </template>
      </PartialQueryButton>`,
    })

    expect(
      partialQueryButtonWrapper.find(getDataTestSelector('partial-query-button__text')).text(),
    ).toBe('Set this partial query lego as the new query.')
  })

  it('emits the UserAcceptedAQuery and UserClickedPartialQuery events when the button is clicked', async () => {
    const userAcceptedAQuery = jest.fn()
    const UserClickedPartialQuery = jest.fn()
    const query = 'coche'
    const { partialQueryButtonWrapper, click } = renderPartialQueryButton({
      query,
    })

    XPlugin.bus.on('UserAcceptedAQuery', true).subscribe(userAcceptedAQuery)
    XPlugin.bus.on('UserClickedPartialQuery', true).subscribe(UserClickedPartialQuery)

    await click()

    expect(userAcceptedAQuery).toHaveBeenNthCalledWith(1, {
      eventPayload: query,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        feature: 'partial_result',
        target: partialQueryButtonWrapper.element,
      }),
    })
    expect(UserClickedPartialQuery).toHaveBeenNthCalledWith(1, {
      eventPayload: query,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        feature: 'partial_result',
        target: partialQueryButtonWrapper.element,
      }),
    })
  })
})

interface RenderPartialQueryButtonOptions {
  /** The template to be rendered. */
  template?: string
  /** The query property. */
  query?: string
}
