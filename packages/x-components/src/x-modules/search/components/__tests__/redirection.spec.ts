import Vuex, { Store } from 'vuex';
import { Redirection as RedirectionModel } from '@empathyco/x-types';
import { createLocalVue, Wrapper, mount } from '@vue/test-utils';
import { createRedirectionStub } from '../../../../__stubs__/redirections-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { WirePayload } from '../../../../wiring/wiring.types';
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

  //eslint-disable-next-line max-len
  it('redirects and emits the `UserClickedARedirection` event in manual mode when the user click the button', () => {
    const { wrapper, acceptRedirection } = renderRedirection({ mode: 'manual' });
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);
    acceptRedirection();

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search'
      }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  //eslint-disable-next-line max-len
  it("doesn't redirect and doesn't emit the event `UserClickedARedirection` in manual when the user doesn't click the button", () => {
    const { wrapper } = renderRedirection({ mode: 'manual' });
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  //eslint-disable-next-line max-len
  it('redirects and emits the `UserClickedARedirection` event in auto mode and 0 seconds of delay', () => {
    const { wrapper } = renderRedirection({ delayInSeconds: 0 });
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);
    // The delay 0 runs so fast the we need to force the test to simulate a wait.
    jest.advanceTimersByTime(1);

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search'
      }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  it('emits the redirection event `UserClickedAbortARedirection`', () => {
    const { wrapper, abortRedirection } = renderRedirection();
    const onUserClickedARedirection = jest.fn();
    const onUserAbortedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);
    wrapper.vm.$x.on('UserClickedAbortARedirection', true).subscribe(onUserAbortedARedirection);
    abortRedirection();
    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
    expect(onUserAbortedARedirection).toHaveBeenCalledTimes(1);
    expect(spy).not.toHaveBeenCalled();
  });

  //eslint-disable-next-line max-len
  it("doesn't redirect and doesn't emit the `UserClickedARedirection` event if there is a new query accepted", () => {
    const { wrapper } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);
    wrapper.vm.$x.emit('UserAcceptedAQuery', 'lego');

    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
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
