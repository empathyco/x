import { mount } from '@vue/test-utils'
import { defineComponent, h, provide, ref, TransitionGroup } from 'vue'
import { DISABLE_ANIMATIONS_KEY } from '../../decorators/injection.consts'
import { useDisableAnimation } from '../use-disable-animation'

const Provider = defineComponent({
  props: {
    disableAnimation: Boolean,
  },
  setup(props, { slots }) {
    provide(DISABLE_ANIMATIONS_KEY as string, ref(props.disableAnimation))
    return () => (slots.default ? slots.default() : h('div'))
  },
})

const Animation = defineComponent({
  setup() {
    return useDisableAnimation('x-animation')
  },
  template: `
    <TransitionGroup :name="name">
     <p>Animation</p>
    </TransitionGroup>
  `,
})

function renderDisableAnimation({ disableAnimation = true } = {}) {
  const wrapper = mount({
    template: `
      <Provider :disableAnimation="disableAnimation">
        <Animation/>
      </Provider>
    `,
    components: { Provider, Animation },
    data: () => ({ disableAnimation }),
  })

  return {
    wrapper,
    transitionGroup: wrapper.findComponent(TransitionGroup),
  }
}

describe('testing disable animation', () => {
  it('should disable the animations', () => {
    const { transitionGroup } = renderDisableAnimation()

    expect(transitionGroup.attributes('name')).toBe('__no-animation__')
  })

  it('should enable the animations', () => {
    const { transitionGroup } = renderDisableAnimation({ disableAnimation: false })

    expect(transitionGroup.attributes('name')).toBe('x-animation')
  })
})
