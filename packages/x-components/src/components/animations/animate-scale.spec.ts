import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AnimateScale from './animate-scale.vue'

describe('testing AnimateScale component', () => {
  it('renders the slot content', () => {
    const wrapper = mount(AnimateScale, {
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toBe('Content')
  })

  it('applies the correct transition name based on animationOrigin prop', async () => {
    const wrapper = mount(AnimateScale, {
      props: {
        animationOrigin: 'bottom',
      },
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-scale--bottom x-animate-scale-')

    await wrapper.setProps({ animationOrigin: 'left' })
    expect(transition.vm.name).toBe('x-animate-scale--left x-animate-scale-')
  })

  it('uses "top" as default animationOrigin', () => {
    const wrapper = mount(AnimateScale, {
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-scale--top x-animate-scale-')
  })
})
