import { Banner as BannerModel } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { createBannerStub } from '../../../../__stubs__/banners-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import Banner from '../banner.vue';
import { XPlugin } from '../../../../plugins/index';

function renderBanner({
  template = `<Banner v-bind="$attrs" />`,
  banner = createBannerStub('default-banner'),
  titleClass
}: RenderBannerOptions = {}) {
  const wrapper = mount(
    {
      components: {
        Banner
      },
      template
    },
    {
      props: {
        banner,
        titleClass
      },
      global: {
        plugins: [installNewXPlugin()]
      }
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

  it('renders a banner component with title', () => {
    const { wrapper } = renderBanner({
      banner: createBannerStub('banner', { title: 'Search UIs' })
    });

    expect(wrapper.get(getDataTestSelector('banner')).text()).toEqual('Search UIs');
  });

  it('renders a banner component without title', () => {
    const { wrapper } = renderBanner({
      banner: createBannerStub('banner')
    });

    expect(wrapper.get(getDataTestSelector('banner')).text()).toEqual('');
  });

  // eslint-disable-next-line max-len
  it('renders a banner which emits UserClickedABanner when the user clicks in the left, middle or right button on the component', () => {
    const listener = jest.fn();
    const banner = createBannerStub('banner', { url: 'https://empathy.co' });
    const { wrapper } = renderBanner({ banner });
    XPlugin.bus.on('UserClickedABanner').subscribe(listener);

    wrapper.trigger('click');
    expect(listener).toHaveBeenNthCalledWith(1, banner);

    wrapper.trigger('click', { button: 1 });
    expect(listener).toHaveBeenNthCalledWith(2, banner);

    wrapper.trigger('click', { button: 2 });
    expect(listener).toHaveBeenNthCalledWith(3, banner);

    expect(listener).toHaveBeenCalledTimes(3);
  });

  it('renders a banner which does not emits any event on click', () => {
    const listener = jest.fn();
    const { wrapper } = renderBanner({
      banner: createBannerStub('banner', { title: 'Search UIs' })
    });
    XPlugin.bus.on('UserClickedABanner').subscribe(listener);

    wrapper.trigger('click');
    expect(listener).not.toHaveBeenCalled();

    wrapper.trigger('click', { button: 1 });
    expect(listener).not.toHaveBeenCalled();

    wrapper.trigger('click', { button: 2 });
    expect(listener).not.toHaveBeenCalled();

    expect(listener).toHaveBeenCalledTimes(0);
  });

  it('allows adding classes to the title', () => {
    const { wrapper } = renderBanner({
      banner: createBannerStub('banner', { title: 'Search UIs' }),
      titleClass: 'custom-class'
    });
    const title = wrapper.get(getDataTestSelector('banner-title'));

    expect(title.classes('custom-class')).toBe(true);
  });
});

interface RenderBannerOptions {
  /** The banner data. */
  banner?: BannerModel;
  /** The template to be rendered. */
  template?: string;
  /** Class to customize the title element. */
  titleClass?: string;
}
