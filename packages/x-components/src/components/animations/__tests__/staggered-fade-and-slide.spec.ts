import { mount } from '@vue/test-utils'
import { ref, TransitionGroup } from 'vue'
import { DISABLE_ANIMATIONS_KEY } from '../../decorators/injection.consts'
import StaggeredFadeAndSlide from '../staggered-fade-and-slide.vue'

function render({ appear = true, tag = 'div', stagger = 25, disableAnimation = false } = {}) {
  const wrapper = mount(StaggeredFadeAndSlide, {
    props: { appear, tag, stagger },
    global: {
      provide: {
        [DISABLE_ANIMATIONS_KEY as string]: ref(disableAnimation),
      },
      stubs: {
        'transition-group': false,
      },
    },
    slots: {
      default: `
        <p key="1">Fist paragraph</p>
        <p key="2">Second paragraph</p>
        <p key="3">Third paragraph</p>
      `,
    },
  })

  return {
    wrapper,
    transitionGroup: wrapper.findComponent(TransitionGroup),
  }
}

describe('testing StaggeredFadeAndSlide component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('renders the TransitionGroup with correct props', () => {
    const appear = false
    const tag = 'ul'

    const { transitionGroup } = render({ appear, tag })

    expect(transitionGroup.exists()).toBeTruthy()
    expect(transitionGroup.props('appear')).toBe(appear)
    expect(transitionGroup.props('tag')).toBe(tag)
    expect(transitionGroup.props('name')).toBe('x-staggered-fade-and-slide')
  })

  it('disables the animation when required', () => {
    const { transitionGroup } = render({ disableAnimation: true })

    expect(transitionGroup.props('name')).toBe('__no-animation__')
  })

  it('renders the animation component with the expected tag wrapping all slotted elements', () => {
    const { wrapper } = render()

    expect(wrapper.find('div')).toBeTruthy()
    expect(wrapper.findAll('p')).toHaveLength(3)
  })

  it('renders each element with the expected delay', () => {
    const transitionDuration = 250
    const stagger = 75
    const { wrapper } = render({ stagger })
    const elements = wrapper.findAll('p')

    for (const [i, el] of elements.entries()) {
      expect(el.element.style.transitionDelay).toBe(`${i * stagger}ms`)
    }

    // Wait for the first transition to finish
    jest.advanceTimersByTime(transitionDuration)

    expect(elements[0].element.style.transitionDelay).toBe('0ms')
    expect(elements[1].element.style.transitionDelay).not.toBe('0ms')
    expect(elements[2].element.style.transitionDelay).not.toBe('0ms')

    // Once the previous transition is finished wait for the stagger delay
    jest.advanceTimersByTime(stagger)

    expect(elements[1].element.style.transitionDelay).toBe('0ms')
    expect(elements[2].element.style.transitionDelay).not.toBe('0ms')

    // Once the previous transition is finished wait for the stagger delay
    jest.advanceTimersByTime(stagger)

    for (const el of elements) {
      expect(el.element.style.transitionDelay).toBe('0ms')
    }
  })
})
