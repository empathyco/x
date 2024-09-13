import { Store } from 'vuex';
import { Redirection as RedirectionModel } from '@empathyco/x-types';
import { DOMWrapper, mount } from '@vue/test-utils';
import { DeepPartial } from '@empathyco/x-utils';
import { nextTick } from 'vue';
import { createRedirectionStub } from '../../../../__stubs__/redirections-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { WirePayload } from '../../../../wiring/wiring.types';
import Redirection from '../redirection.vue';
import { RootXStoreState } from '../../../../store/index';
import { XDummyBus } from '../../../../__tests__/bus.dummy';
import { searchXModule } from '../../x-module';
import { resetXSearchStateWith } from './utils';

const stubRedirections = [createRedirectionStub('redirection')];
let bus = new XDummyBus();
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
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

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
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] }, bus)]
      }
    }
  );
  resetXSearchStateWith(store, { redirections });

  const onUserAbortedARedirection = jest.fn();
  XPlugin.bus.on('UserClickedAbortARedirection', true).subscribe(onUserAbortedARedirection);

  const onUserClickedARedirection = jest.fn();
  XPlugin.bus.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection);

  return {
    wrapper: wrapper.findComponent(Redirection),
    acceptRedirection: () => {
      (wrapper.find(getDataTestSelector('redirection-accept')) as DOMWrapper<any>).element.click();
    },
    abortRedirection: () => {
      (wrapper.find(getDataTestSelector('redirection-abort')) as DOMWrapper<any>).element.click();
    },
    onUserClickedARedirection,
    onUserAbortedARedirection
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
    bus = new XDummyBus();
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

    expect(wrapper.find('.x-redirection').exists()).toBe(false);
  });

  it('renders the redirection component slot', async () => {
    const { wrapper } = renderRedirection({
      template: `
        <Redirection
        :mode="mode"
        :delayInSeconds="delayInSeconds"
        v-slot="{ redirection, redirect, abortRedirect }">
          <span data-test="redirection-url">{{ redirection.url }}</span>
        </Redirection>`
    });

    await nextTick();

    expect(wrapper.get(getDataTestSelector('redirection-url')).text()).toEqual(
      stubRedirections[0].url
    );
  });

  //eslint-disable-next-line max-len
  it('redirects and emits the `UserClickedARedirection` event in manual mode when the user click the button', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { onUserClickedARedirection, acceptRedirection } = renderRedirection({ mode: 'manual' });

    await nextTick();

    acceptRedirection();

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search',
        location: 'none',
        replaceable: true
      }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  //eslint-disable-next-line max-len
  it("doesn't redirect and doesn't emit the event `UserClickedARedirection` in manual when the user doesn't click the button", () => {
    const { onUserClickedARedirection } = renderRedirection({ mode: 'manual' });

    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  //eslint-disable-next-line max-len
  it('redirects and emits the `UserClickedARedirection` event in auto mode and 0 seconds of delay', async () => {
    const { onUserClickedARedirection } = renderRedirection({ delayInSeconds: 0 });

    await nextTick();
    // The delay 0 runs so fast the we need to force the test to simulate a wait.
    jest.advanceTimersByTime(1);

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1);
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search',
        location: 'none',
        replaceable: true
      }
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url);
  });

  it('emits the redirection event `UserClickedAbortARedirection`', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { onUserClickedARedirection, onUserAbortedARedirection, abortRedirection } =
      renderRedirection();

    await nextTick();

    abortRedirection();
    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
    expect(onUserAbortedARedirection).toHaveBeenCalledTimes(1);
    expect(spy).not.toHaveBeenCalled();
  });

  //eslint-disable-next-line max-len
  it("doesn't redirect and doesn't emit the `UserClickedARedirection` event if there is a new query accepted", () => {
    const { onUserClickedARedirection } = renderRedirection();
    XPlugin.bus.emit('UserAcceptedAQuery', 'lego');

    jest.runAllTicks();

    expect(onUserClickedARedirection).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});
