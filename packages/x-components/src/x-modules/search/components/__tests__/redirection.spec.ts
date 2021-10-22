import Vuex, { Store } from 'vuex';
import { Redirection as RedirectionModel } from '@empathyco/x-types';
import { createLocalVue, Wrapper, mount } from '@vue/test-utils';
import { createRedirectionStub } from '../../../../__stubs__';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { RootXStoreState } from '../../../../store';
import { DeepPartial } from '../../../../utils';
import { WirePayload } from '../../../../wiring';
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
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useFakeTimers();
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
  });

  it("doesn't emit the event in manual when the user doesn't click the button", () => {
    const { wrapper } = renderRedirection({ mode: 'manual' });
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
  });

  it('accepts the redirection in auto mode', () => {
    const { wrapper } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    jest.advanceTimersByTime(2000);

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search'
      }
    });
  });

  it('redirects instantly in auto mode and 0 delay', () => {
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
  });

  it('aborts the redirection', () => {
    const { wrapper, abortRedirection } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

    abortRedirection();
    jest.advanceTimersByTime(2000);

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
  });

  it("doesn't emit the event `UserClickedARedirection` if there is a new query accepted", () => {
    const { wrapper } = renderRedirection();
    const onUserClickedARedirection = jest.fn();

    wrapper.vm.$x.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);
    wrapper.vm.$x.emit('UserAcceptedAQuery', 'lego');

    jest.advanceTimersByTime(2000);

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
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
