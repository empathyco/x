import { Promoted as PromotedModel } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createPromotedStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import Promoted from '../promoted.vue';

function renderPromoted({
  template = `<Promoted :promoted="promoted"/>`,
  promoted = createPromotedStub('default-promoted')
}: RenderPromotedOptions = {}): RenderPromotedAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      components: {
        Promoted
      },
      props: ['promoted'],
      template
    },
    {
      propsData: {
        promoted
      },
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(Promoted)
  };
}

describe('testing Promoted component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderPromoted();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderPromoted();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the promoted component', () => {
    const { wrapper } = renderPromoted({
      promoted: {
        modelName: 'Promoted',
        id: '12345',
        url: 'https://empathy.co',
        title: 'Search UIs',
        image: 'https://empathy.co/x-components.jpg',
        tagging: {
          click: { url: 'https://track-things.com', params: {} }
        }
      }
    });

    expect(wrapper.get(getDataTestSelector('promoted')).text()).toEqual('Search UIs');
  });
});

interface RenderPromotedOptions {
  /** The promoted data. */
  promoted?: PromotedModel;
  /** The template to be rendered. */
  template?: string;
}

interface RenderPromotedAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
