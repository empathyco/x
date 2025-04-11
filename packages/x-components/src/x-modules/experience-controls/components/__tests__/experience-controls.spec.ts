import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/index'
import { XPlugin } from '../../../../plugins/index'
import { experienceControlsXModule } from '../../x-module'
import ExperienceControls from '../experience-controls.vue'

function renderExperienceControls(): RenderExperienceControlsApi {
  XPlugin.registerXModule(experienceControlsXModule)

  const wrapper = mount(ExperienceControls, {
    global: { plugins: [installNewXPlugin()] },
  })

  return {
    wrapper,
  }
}

describe('testing experience controls component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderExperienceControls()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('experienceControls')
  })

  it('listens to the event ExperienceControlsEventsChanged and emits the events on the payload', () => {
    renderExperienceControls()

    const eventsFromExperienceControls = {
      ExtraParamsProvided: {
        warehouse: 'Magrathea',
      },
      SortChanged: 'price:desc',
    }

    const extraParamsProvidedListener = jest.fn()
    XPlugin.bus.on('ExtraParamsProvided').subscribe(extraParamsProvidedListener)

    const sortChangedListener = jest.fn()
    XPlugin.bus.on('SortChanged').subscribe(sortChangedListener)

    void XPlugin.bus.emit('ExperienceControlsEventsChanged', eventsFromExperienceControls)

    expect(extraParamsProvidedListener).toHaveBeenCalledTimes(1)
    expect(extraParamsProvidedListener).toHaveBeenCalledWith({
      warehouse: 'Magrathea',
    })

    expect(sortChangedListener).toHaveBeenCalledTimes(1)
    expect(sortChangedListener).toHaveBeenCalledWith('price:desc')
  })
})

interface RenderExperienceControlsApi {
  /** The wrapper for the experience controls component. */
  wrapper: VueWrapper
}
