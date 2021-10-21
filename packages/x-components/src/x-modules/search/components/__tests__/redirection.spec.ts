import Vuex, { Store } from 'vuex';
import { Redirection as RedirectionModel } from '@empathyco/x-types';
import { createLocalVue, Wrapper, mount } from '@vue/test-utils';
import { createRedirectionStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { DeepPartial } from '../../../../utils';
import Redirection from '../redirection.vue';
import { resetXSearchStateWith } from './utils';

function renderRedirection({
  template = `
  <Redirection :mode="mode" :delayMs="delayMs">
  <template v-slot="{ redirection, redirect, abortRedirect }">
      <span data-test="redirection-url">{{ redirection.url }}</span>
      <button data-test="redirection-accept" @click="redirect">Redirect now!</button>
      <button data-test="redirection-abort" @click="abortRedirect">Abort redirection!</button>
    </template>
  </Redirection>
`,
  redirections = [createRedirectionStub('redirection')],
  mode = 'auto',
  delayMs = 1
}: RenderRedirectionOptions = {}): RenderRedirectionAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();
  resetXSearchStateWith(store, { redirections });
  const wrapper = mount(
    {
      components: {
        Redirection
      },
      props: ['mode', 'delayMs'],
      template
    },
    {
      propsData: {
        mode,
        delayMs
      },
      localVue,
      store
    }
  );

  const redirectionWrapper = wrapper.findComponent(Redirection);

  return {
    wrapper,
    redirectionWrapper,
    acceptRedirection() {
      redirectionWrapper.find(getDataTestSelector('redirection-accept')).element.click();
    },
    abortRedirection() {
      redirectionWrapper.find(getDataTestSelector('redirection-abort')).element.click();
    }
  };
}

describe('testing Redirection component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useFakeTimers();
  });

  it('is an XComponent', () => {
    const { redirectionWrapper } = renderRedirection();
    expect(isXComponent(redirectionWrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { redirectionWrapper } = renderRedirection();
    expect(getXComponentXModuleName(redirectionWrapper.vm)).toEqual('search');
  });

  it("doesn't render when there are no redirections", () => {
    const { redirectionWrapper } = renderRedirection({ redirections: [] });

    expect(redirectionWrapper.html()).toBe('');
  });

  it('renders the redirection component slot', () => {
    const { redirectionWrapper } = renderRedirection({
      template: `
        <Redirection :mode="mode" :delayMs="delayMs">
          <template v-slot="{ redirection, redirect, abortRedirect }">
            <span data-test="redirection-url">{{ redirection.url }}</span>
          </template>
        </Redirection>`
    });

    expect(redirectionWrapper.get(getDataTestSelector('redirection-url')).text()).toEqual(
      'https://picsum.photos/seed/redirection/500'
    );
  });

  it('accepts the redirection in manual mode when the user click the button', () => {
    const { wrapper, acceptRedirection } = renderRedirection({ mode: 'manual' });
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    acceptRedirection();

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
  });

  it('accepts the redirection in auto mode', () => {
    const { wrapper } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    jest.advanceTimersByTime(2000);

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
  });

  it('aborts the redirection', () => {
    const { wrapper, abortRedirection } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    abortRedirection();
    jest.advanceTimersByTime(2000);

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
  });
});

interface RenderRedirectionOptions {
  /** The redirection mode. */
  mode?: 'auto' | 'manual';
  /** The redirection delay in milliseconds. */
  delayMs?: number;
  /** The template to be rendered. */
  template?: string;
  /** List of redirections to be rendered. */
  redirections?: RedirectionModel[];
}

interface RenderRedirectionAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** The wrapper of the container element.*/
  redirectionWrapper: Wrapper<Vue>;
  /** Helper method to accept a redirection. */
  acceptRedirection: () => void;
  /** Helper method to abort a redirection. */
  abortRedirection: () => void;
}
