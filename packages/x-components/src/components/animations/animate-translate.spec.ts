import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AnimateTranslate from './animate-translate.vue'

describe('testing AnimateTranslate component', () => {
  it('renders the slot content', () => {
    const wrapper = mount(AnimateTranslate, {
      slots: {
        default: '<div class="test-content">Content</div>',
      },
    })

    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toBe('Content')
  })

  it('applies the correct transition name based on animationOrigin prop', async () => {
    const wrapper = mount(AnimateTranslate, {
      props: {
        animationOrigin: 'bottom',
      },
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-translate--bottom x-animate-translate-')

    await wrapper.setProps({ animationOrigin: 'left-to-right' })
    expect(transition.vm.name).toBe('x-animate-translate--left-to-right x-animate-translate-')
  })

  it('uses "top" as default animationOrigin', () => {
    const wrapper = mount(AnimateTranslate, {
      slots: {
        default: '<div>Content</div>',
      },
    })

    const transition = wrapper.findComponent({ name: 'Transition' })
    expect(transition.vm.name).toBe('x-animate-translate--top x-animate-translate-')
  })
})
