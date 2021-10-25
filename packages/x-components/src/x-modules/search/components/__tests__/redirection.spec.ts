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

const stubRedirections = [createRedirectionStub('redirection')];

function renderRedirection({
  template = `
  <Redirection 
    :mode="mode" 
    :delayInSeconds="delayInSeconds"
    v-slot="{ redirection, redirect, abortRedirect }">
     <span data-test="redirection-url">{{ redirection.url }}</span>
     <button data-test="redirection-accept" @click="redirect">Redirect now!</button>
     <button data-test="redirection-abort" @click="abortRedirect">Abort redirection!</button>
  </Redirection>
`,
  redirections = stubRedirections,
  mode = 'auto',
  delayInSeconds = 1
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
      template
    },
    {
      data() {
        return {
          mode,
          delayInSeconds
        };
      },
      localVue,
      store
    }
  );

  return {
    wrapper: wrapper.findComponent(Redirection),
    acceptRedirection() {
      wrapper.find(getDataTestSelector('redirection-accept')).element.click();
    },
    abortRedirection() {
      wrapper.find(getDataTestSelector('redirection-abort')).element.click();
    }
  };
}

describe('testing Redirection component', () => {
  const spy = jest.fn();
  const { location } = window;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete window.location;
    window.location = { ...location, replace: spy };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    window.location = location;
  });

  it('is an XComponent', () => {
    const { wrapper } = renderRedirection();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('has Search as XModule', () => {
    const { wrapper } = renderRedirection();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search');
  });

  it("doesn't render when there are no redirections", () => {
    const { wrapper } = renderRedirection({ redirections: [] });

    expect(wrapper.html()).toBe('');
  });

  it('renders the redirection component slot', () => {
    const { wrapper } = renderRedirection({
      template: `
        <Redirection
        :mode="mode"
        :delayInSeconds="delayInSeconds"
        v-slot="{ redirection, redirect, abortRedirect }">
          <span data-test="redirection-url">{{ redirection.url }}</span>
        </Redirection>`
    });

    expect(wrapper.get(getDataTestSelector('redirection-url')).text()).toEqual(
      stubRedirections[0].url
    );
  });

  it('accepts the redirection in manual mode when the user click the button', () => {
    const { acceptRedirection } = renderRedirection({ mode: 'manual' });

    acceptRedirection();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  it("doesn't emit the event in manual when the user doesn't click the button", () => {
    renderRedirection({ mode: 'manual' });

    jest.runAllTicks();

    expect(spy).not.toHaveBeenCalled();
  });

  it('redirects instantly in auto mode and 0 delay', () => {
    renderRedirection({ delayInSeconds: 0 });

    // The delay 0 runs so fast the we need to force the test to simulate a wait.
    jest.runTimersToTime(1);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  it('aborts the redirection', () => {
    const { abortRedirection } = renderRedirection();

    abortRedirection();
    jest.runAllTicks();

    expect(spy).not.toHaveBeenCalled();
  });

  it("doesn't emit the event `UserClickedARedirection` if there is a new query accepted", () => {
    const { wrapper } = renderRedirection();

    wrapper.vm.$x.emit('UserAcceptedAQuery', 'lego');

    jest.runAllTicks();

    expect(spy).not.toHaveBeenCalled();
  });
});

interface RenderRedirectionOptions {
  /** The redirection mode. */
  mode?: 'auto' | 'manual';
  /** The redirection delay in seconds. */
  delayInSeconds?: number;
  /** The template to be rendered. */
  template?: string;
  /** List of redirections to be rendered. */
  redirections?: RedirectionModel[];
}

interface RenderRedirectionAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** Helper method to accept a redirection. */
  acceptRedirection: () => void;
  /** Helper method to abort a redirection. */
  abortRedirection: () => void;
}
