import { Promoted as PromotedModel } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { createPromotedStub } from '../../../../__stubs__/promoteds-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import Promoted from '../promoted.vue';

function renderPromoted({
  template = `<Promoted v-bind="$attrs"/>`,
  promoted = createPromotedStub('default-promoted'),
  titleClass
}: RenderPromotedOptions = {}) {
  const wrapper = mount(
    {
      components: {
        Promoted
      },
      template
    },
    {
      props: {
        promoted,
        titleClass
      },
      global: {
        plugins: [installNewXPlugin()]
      }
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
        position: 1,
        tagging: {
          click: { url: 'https://track-things.com', params: {} }
        }
      }
    });

    expect(wrapper.get(getDataTestSelector('promoted')).text()).toEqual('Search UIs');
  });

  it('allows adding classes to the title', () => {
    const { wrapper } = renderPromoted({
      titleClass: 'custom-class'
    });
    const title = wrapper.get(getDataTestSelector('promoted-title'));

    expect(title.classes('custom-class')).toBe(true);
  });
});

interface RenderPromotedOptions {
  /** The promoted data. */
  promoted?: PromotedModel;
  /** The template to be rendered. */
  template?: string;
  /** Class to customize the title element. */
  titleClass?: string;
}
