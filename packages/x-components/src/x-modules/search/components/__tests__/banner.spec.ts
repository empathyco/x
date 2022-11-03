import { Banner as BannerModel } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { createBannerStub } from '../../../../__stubs__/banners-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import Banner from '../banner.vue';

function renderBanner({
  template = `<Banner :banner="banner"/>`,
  banner = createBannerStub('default-banner')
}: RenderBannerOptions = {}): RenderBannerAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      components: {
        Banner
      },
      props: ['banner'],
      template
    },
    {
      propsData: {
        banner
      },
      localVue
    }
  );

  return {
    wrapper: wrapper.findComponent(Banner)
  };
}

describe('testing Banner component', () => {
  it('is an XComponent', () => {
    const { wrapper } = renderBanner();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderBanner();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it('renders the banner component', () => {
    const { wrapper } = renderBanner({
      banner: {
        modelName: 'Banner',
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

    expect(wrapper.get(getDataTestSelector('banner')).text()).toEqual('Search UIs');
  });
});

interface RenderBannerOptions {
  /** The banner data. */
  banner?: BannerModel;
  /** The template to be rendered. */
  template?: string;
}

interface RenderBannerAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
