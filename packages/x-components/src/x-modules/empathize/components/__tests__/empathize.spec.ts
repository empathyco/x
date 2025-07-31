import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { XPlugin } from '../../../../plugins/index'
import Empathize from '../empathize.vue'

function render({
  eventsToOpenEmpathize = ['UserClickedSearchBox'],
  eventsToCloseEmpathize = ['UserClosedEmpathize'],
  template = `
    <Empathize v-bind="$attrs">
      <template #default>
        <span data-test="empathize-content">Empathize</span>
      </template>
    </Empathize>`,
} = {}) {
  const parent = document.createElement('div')
  document.body.appendChild(parent)

  const wrapper = mount(
    {
      components: { Empathize },
      template,
    },
    {
      attachTo: parent,
      props: {
        eventsToOpenEmpathize,
        eventsToCloseEmpathize,
      },
      global: {
        plugins: [installNewXPlugin()],
      },
    },
  )

  return {
    wrapper: wrapper.findComponent(Empathize),
  }
}

describe('testing empathize component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = render()

    expect(isXComponent(wrapper.vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('empathize')
  })

  it('will not open empathize if there is no content to render', async () => {
    const template = `<Empathize v-bind="$attrs"/>`
    const { wrapper } = render({ template })

    await XPlugin.bus.emit('UserClickedSearchBox', undefined)

    expect(wrapper.find(getDataTestSelector('empathize')).exists()).toBeTruthy()
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBeFalsy()
  })

  it('listens to UserOpenedEmpathize and UserClosedEmpathize by default', async () => {
    const { wrapper } = render()

    await XPlugin.bus.emit('UserClickedSearchBox', undefined)
    jest.runAllTimers()
    await nextTick()

    // Both should exist and be visible
    expect(wrapper.find(getDataTestSelector('empathize')).exists()).toBeTruthy()
    expect(wrapper.find(getDataTestSelector('empathize')).element).toBeVisible()
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBeTruthy()
    expect(wrapper.find(getDataTestSelector('empathize-content')).element).toBeVisible()

    await XPlugin.bus.emit('UserClosedEmpathize', undefined)
    jest.runAllTimers()
    await nextTick()

    // Both should exist, as v-show doesn't remove the elements in the DOM, and not be visible
    expect(wrapper.find(getDataTestSelector('empathize')).exists()).toBeTruthy()
    expect(wrapper.find(getDataTestSelector('empathize')).element).not.toBeVisible()
    expect(wrapper.find(getDataTestSelector('empathize-content')).exists()).toBeTruthy()
    expect(wrapper.find(getDataTestSelector('empathize-content')).element).not.toBeVisible()
  })
})
