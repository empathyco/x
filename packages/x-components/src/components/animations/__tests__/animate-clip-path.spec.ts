import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AnimateClipPath from '../animate-clip-path.vue'

describe('testing AnimateClipPath component', () => {
  it('renders the slot content', () => {
    const wrapper = mount(AnimateClipPath, {
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toBe('Content')
  })

  it('applies the correct transition name based on animationOrigin prop', async () => {
    const wrapper = mount(AnimateClipPath, {
      props: {
        animationOrigin: 'bottom',
      },
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-clip-path--bottom x-animate-clip-path-')

    await wrapper.setProps({ animationOrigin: 'right-to-left' })
    expect(transition.vm.name).toBe('x-animate-clip-path--right-to-left x-animate-clip-path-')
  })

  it('uses "top" as default animationOrigin', () => {
    const wrapper = mount(AnimateClipPath, {
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-clip-path--top x-animate-clip-path-')
  })
})
