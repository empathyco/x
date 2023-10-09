import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../../plugins/index';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { experienceControlsXModule } from '../../x-module';
import { getXComponentXModuleName, isXComponent } from '../../../../components/index';
import ExperienceControls from '../experience-controls.vue';

function renderExperienceControls(): RenderExperienceControlsApi {
  const [, localVue] = installNewXPlugin();
  XPlugin.registerXModule(experienceControlsXModule);

  const wrapper = mount(ExperienceControls, {
    localVue
  });

  return {
    wrapper
  };
}

describe('testing experience controls component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderExperienceControls();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('experienceControls');
  });

  // eslint-disable-next-line max-len
  it('listens to the event ExperienceControlsEventsChanged and emits the events on the payload', () => {
    const { wrapper } = renderExperienceControls();

    const eventsFromExperienceControls = {
      ExtraParamsProvided: {
        warehouse: 'Magrathea'
      },
      SortChanged: 'price:desc'
    };

    const extraParamsProvidedListener = jest.fn();
    wrapper.vm.$x.on('ExtraParamsProvided').subscribe(extraParamsProvidedListener);

    const sortChangedListener = jest.fn();
    wrapper.vm.$x.on('SortChanged').subscribe(sortChangedListener);

    wrapper.vm.$x.emit('ExperienceControlsEventsChanged', eventsFromExperienceControls);

    expect(extraParamsProvidedListener).toHaveBeenCalledTimes(1);
    expect(extraParamsProvidedListener).toHaveBeenCalledWith({
      warehouse: 'Magrathea'
    });

    expect(sortChangedListener).toHaveBeenCalledTimes(1);
    expect(sortChangedListener).toHaveBeenCalledWith('price:desc');
  });
});

interface RenderExperienceControlsApi {
  /** The wrapper for the experience controls component. */
  wrapper: Wrapper<Vue>;
}
