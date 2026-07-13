import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { createResultStub } from '../../../__stubs__/results-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins/index'
import BaseResultLink from '../base-result-link.vue'

describe('testing BaseResultLink component', () => {
  const result = {
    ...createResultStub('Product 001', {
      images: ['https://picsum.photos/seed/1/200/300', 'https://picsum.photos/seed/2/200/300'],
    }),
    modelName: 'Result' as const,
  }

  it('emits the events provided through events prop', async () => {
    const wrapper = mount(BaseResultLink, {
      props: {
        result,
        events: {
          UserClickedAResult: result,
        },
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserClickedAResult').subscribe(listener)

    await wrapper.trigger('click')
    expect(listener).toHaveBeenCalledWith(result)

    await wrapper.trigger('click', { button: 1 })
    expect(listener).toHaveBeenCalledTimes(2)

    await wrapper.trigger('contextmenu')
    expect(listener).toHaveBeenCalledTimes(3)
  })

  it('emits events with custom metadata', async () => {
    const wrapper = mount(BaseResultLink, {
      props: {
        result,
        events: {
          UserClickedAResult: result,
        },
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserClickedAResult', true).subscribe(listener)

    await wrapper.trigger('click')

    expect(listener).toHaveBeenCalledWith({
      eventPayload: result,
      metadata: expect.any(Object),
    })
  })

  it('emits multiple events', async () => {
    const wrapper = mount(BaseResultLink, {
      props: {
        result,
        events: {
          UserClickedAResult: result,
          UserClickedResultAddToCart: result,
        },
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    })

    const resultListener = vi.fn()
    const addToCartListener = vi.fn()
    XPlugin.bus.on('UserClickedAResult').subscribe(resultListener)
    XPlugin.bus.on('UserClickedResultAddToCart').subscribe(addToCartListener)

    await wrapper.trigger('click')

    expect(resultListener).toHaveBeenCalledWith(result)
    expect(addToCartListener).toHaveBeenCalledWith(result)
  })

  it('renders the content overriding default slot', () => {
    const wrapperComponent = {
      template: `
        <BaseResultLink :result="result">
          <template #default="{ result }">
            <img data-test="result-link-image" src="${result.images![0]}"/>
            <span data-test="result-link-text">
              {{ result.name }}
            </span>
          </template>
        </BaseResultLink>
      `,
      props: ['result'],
      components: {
        BaseResultLink,
      },
      setup() {
        return {
          result: { ...result, modelName: 'Result' },
        }
      },
    }

    const customResultLinkWrapper = mount(wrapperComponent, {
      props: { result: { ...result, modelName: 'Result' } },
    })
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link')).element).toBeDefined()
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).element,
    ).toBeDefined()
    expect(
      customResultLinkWrapper.find(getDataTestSelector('result-link-image')).attributes('src'),
    ).toEqual(result.images![0])
    expect(customResultLinkWrapper.find(getDataTestSelector('result-link-text')).text()).toEqual(
      result.name,
    )
  })
})
