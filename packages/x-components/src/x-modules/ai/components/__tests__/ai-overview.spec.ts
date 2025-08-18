import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AIOverview from '../ai-overview.vue'

function render({ slot = undefined } = {}) {
  const wrapper = mount(AIOverview, {
    slots: {
      default: slot,
    },
  })

  return {
    wrapper,
    get expandButton() {
      return wrapper.find('button')
    },
    get loadingText() {
      return wrapper.find('.x-animate-pulse .animate-pulse')
    },
    get overviewTitle() {
      return wrapper.find('.x-font-bold')
    },
    get slotContent() {
      return wrapper.find('slot')
    },
  }
}

describe('ai-overview.vue', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('shows loading state initially and then overview title', async () => {
    const { wrapper, loadingText, overviewTitle } = render()
    expect(loadingText.exists()).toBeTruthy()
    expect(overviewTitle.exists()).toBeFalsy()

    // Simulate timeout to finish loading
    jest.runAllTimers()
    await nextTick()
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.find('.x-font-bold').exists()).toBeTruthy()
  })

  it('shows slot content when expanded', async () => {
    const slotText = 'Custom slot content'
    const { wrapper, expandButton } = render({ expanded: false, slot: slotText })

    // Initially not expanded, slot content should not be visible
    expect(wrapper.text()).not.toContain(slotText)
    // Click show more
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.vm.expanded).toBe(true)
    expect(wrapper.text()).toContain(slotText)
  })

  it('renders default slot fallback if no slot is provided', async () => {
    const { wrapper, expandButton } = render({ expanded: false })
    await expandButton.trigger('click')
    await nextTick()
    expect(wrapper.vm.expanded).toBe(true)
    // Should contain the default fallback text
    expect(wrapper.text()).toContain(
      'It is a long established fact that a reader will be distracted',
    )
  })
})
