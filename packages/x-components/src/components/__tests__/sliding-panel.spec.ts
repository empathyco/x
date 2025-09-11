import { mount } from '@vue/test-utils'
import { nextTick, reactive, ref } from 'vue'
import { getDataTestSelector } from '../../__tests__/utils'
import SlidingPanel from '../sliding-panel.vue'

let mutationCallback: undefined | ((mutations: any[]) => void)
let measureSpy: jest.Mock | undefined

jest.mock('@vueuse/core', () => {
  const useElementBounding = () => ({ width: ref(100) })

  const useElementVisibility = () => ref(true)

  const useScroll = () => {
    const x = ref(0)
    const arrivedState = reactive({ left: true, right: false })
    const measure = jest.fn()
    measureSpy = measure
    return { x, arrivedState, measure }
  }

  const useMutationObserver = (_target: unknown, cb: (mutations: any[]) => void) => {
    mutationCallback = cb
  }

  const whenever = (source: any, cb: () => void) => {
    // eslint-disable-next-line ts/no-unsafe-call
    const value = typeof source === 'function' ? source() : (source?.value ?? source)
    if (value) {
      cb()
    }
  }

  return { useElementBounding, useElementVisibility, useScroll, useMutationObserver, whenever }
})

function renderSlidingPanel({
  slots = {},
  showButtons = true,
  scrollFactor = 0.7,
  resetOnContentChange = true,
  buttonClass = '',
  scrollContainerClass = '',
}: RenderSlidingPanelOptions = {}) {
  const wrapper = mount(SlidingPanel, {
    props: {
      showButtons,
      scrollFactor,
      resetOnContentChange,
      buttonClass,
      scrollContainerClass,
    } as any,
    slots,
  })

  return {
    wrapper,
    getRoot: () => wrapper.find(getDataTestSelector('sliding-panel')),
    getScroll: () => wrapper.find(getDataTestSelector('sliding-panel-scroll')),
    getLeftButton: () => wrapper.find(getDataTestSelector('sliding-panel-left-button')),
    getRightButton: () => wrapper.find(getDataTestSelector('sliding-panel-right-button')),
    triggerMutation: async () => {
      mutationCallback && mutationCallback([{} as any])
      await nextTick()
    },
  }
}

describe('testing SlidingPanel component', () => {
  it('renders basic structure with default content and buttons', () => {
    const { getRoot, getScroll, getLeftButton, getRightButton } = renderSlidingPanel({
      slots: { default: '<div class="item">Item</div>' },
    })

    expect(getRoot().exists()).toBeTruthy()
    expect(getScroll().exists()).toBeTruthy()
    expect(getLeftButton().exists()).toBeTruthy()
    expect(getRightButton().exists()).toBeTruthy()
  })

  it('hides buttons when showButtons is false', () => {
    const { getLeftButton, getRightButton } = renderSlidingPanel({
      showButtons: false,
      slots: { default: '<div>Content</div>' },
    })

    expect(getLeftButton().exists()).toBeFalsy()
    expect(getRightButton().exists()).toBeFalsy()
  })

  it('clicking right/left buttons updates the x scroll based on width and scrollFactor', async () => {
    const { wrapper, getRightButton, getLeftButton } = renderSlidingPanel({
      slots: { default: '<div style="width: 1000px">Content</div>' },
    })

    const vm = wrapper.vm as any

    // Initial x is 0; width mocked to 100 and default factor 0.7
    await getRightButton().trigger('click')
    await nextTick()
    expect(vm.xScroll).toBeCloseTo(70)

    await getRightButton().trigger('click')
    await nextTick()
    expect(vm.xScroll).toBeCloseTo(140)

    await getLeftButton().trigger('click')
    await nextTick()
    expect(vm.xScroll).toBeCloseTo(70)
  })

  it('applies classes based on arrivedState (start/end)', async () => {
    const { wrapper, getRoot } = renderSlidingPanel({
      slots: { default: '<div>Content</div>' },
    })

    // Initially mocked as at start
    expect(getRoot().classes()).not.toContain('x-sliding-panel-at-end')
    expect(getRoot().classes()).toContain('x-sliding-panel-at-start')

    // Change arrived state to end
    ;(wrapper.vm as any).arrivedState.left = false
    ;(wrapper.vm as any).arrivedState.right = true
    await nextTick()

    expect(getRoot().classes()).not.toContain('x-sliding-panel-at-start')
    expect(getRoot().classes()).toContain('x-sliding-panel-at-end')
  })

  it('applies buttonClass and scrollContainerClass props', () => {
    const { getScroll, getLeftButton, getRightButton } = renderSlidingPanel({
      buttonClass: 'custom-button',
      scrollContainerClass: 'custom-scroll',
      slots: { default: '<div>Content</div>' },
    })

    expect(getScroll().classes()).toContain('custom-scroll')
    expect(getLeftButton().classes()).toContain('custom-button')
    expect(getRightButton().classes()).toContain('custom-button')
  })

  it('resets the scroll to 0 when content changes and resetOnContentChange is true', async () => {
    const { wrapper, triggerMutation } = renderSlidingPanel({
      slots: { default: '<div>Content</div>' },
      resetOnContentChange: true,
    })

    ;(wrapper.vm as any).xScroll = 50
    await nextTick()

    await triggerMutation()

    expect((wrapper.vm as any).xScroll).toBe(0)
  })

  it('calls measure via whenever when the panel becomes visible', () => {
    renderSlidingPanel({ slots: { default: '<div>Content</div>' } })
    expect(measureSpy).toHaveBeenCalled()
  })
})

interface RenderSlidingPanelOptions {
  slots?: Record<string, string>
  showButtons?: boolean
  scrollFactor?: number
  resetOnContentChange?: boolean
  buttonClass?: string
  scrollContainerClass?: string
}
