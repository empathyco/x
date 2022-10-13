import { mount, Wrapper } from '@vue/test-utils';

import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { XEvent } from '../../../../wiring';
import { searchBoxXModule } from '../../x-module';
import SearchInput from '../search-input.vue';
import SearchInputPlaceholder from '../search-input-placeholder.vue';

async function mountTestComponent(params: TestComponentParams = {}): Promise<TestComponentAPI> {
  const messages = [
    'Find shirts',
    'Find shoes',
    'Find watches',
    'Find handbags',
    'Find sunglasses'
  ];

  const [, localVue] = installNewXPlugin();
  XPlugin.registerXModule(searchBoxXModule);

  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(
    {
      template: `
        <div>
          <SearchInputPlaceholder
            :messages="messages"
            :animationIntervalMs="animationIntervalMs"
            :animateOnlyOnHover="animateOnlyOnHover"
          />
          <SearchInput :autofocus="autofocus" />
        </div>
      `,
      props: ['messages', 'animationIntervalMs', 'animateOnlyOnHover', 'autofocus'],
      components: {
        SearchInputPlaceholder,
        SearchInput
      }
    },
    {
      localVue,
      /*
       * In order to make the autofocus test work after the jest 27 update, now is mandatory to
       * attach the element to some parent in the DOM, to emit the focus event.
       */
      attachTo: parent,
      propsData: {
        messages: params.messages ?? messages,
        animationIntervalMs: params.animationIntervalMs,
        animateOnlyOnHover: params.animateOnlyOnHover,
        autofocus: params.autofocus ?? false
      }
    }
  );
  await wrapper.vm.$nextTick();

  function getPlaceholderText(): string {
    return wrapper.find(getDataTestSelector('search-input-placeholder')).text();
  }

  function isPlaceholderVisible(): boolean {
    return wrapper.find(getDataTestSelector('search-input-placeholder')).exists();
  }

  function hoverInput(mode: 'in' | 'out'): Promise<void> {
    const inputWrapper = wrapper.findComponent(SearchInput);
    const hoverEvent = {
      in: 'mouseenter',
      out: 'mouseleave'
    }[mode];
    inputWrapper.trigger(hoverEvent);
    return wrapper.vm.$nextTick();
  }

  async function emit(event: XEvent, payload: any): Promise<void> {
    wrapper.vm.$x.emit(event, payload);
    await localVue.nextTick();
  }

  return {
    messages,
    wrapper,
    getPlaceholderText,
    isPlaceholderVisible,
    hoverInput,
    emit
  };
}

interface TestComponentParams {
  messages?: Array<string>;
  animationIntervalMs?: number;
  animateOnlyOnHover?: boolean;
  autofocus?: boolean;
}

interface TestComponentAPI {
  messages: Array<string>;
  wrapper: Wrapper<Vue>;
  getPlaceholderText: () => string;
  isPlaceholderVisible: () => boolean;
  hoverInput: (mode: 'in' | 'out') => Promise<void>;
  emit: (event: XEvent, payload: any) => Promise<void>;
}

describe('testing search input placeholder component', () => {
  beforeAll(jest.useFakeTimers);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(jest.clearAllTimers);

  it('is an XComponent', async () => {
    const { wrapper } = await mountTestComponent();
    const placeholderWrapper = wrapper.findComponent(SearchInputPlaceholder);

    expect(isXComponent(placeholderWrapper.vm)).toEqual(true);
  });

  it('has SearchBox as XModule', async () => {
    const { wrapper } = await mountTestComponent();
    const placeholderWrapper = wrapper.findComponent(SearchInputPlaceholder);

    expect(getXComponentXModuleName(placeholderWrapper.vm)).toEqual('searchBox');
  });

  it('animates the rendered text always', async () => {
    const { messages, wrapper, getPlaceholderText } = await mountTestComponent();

    for (const message of messages) {
      expect(getPlaceholderText()).toEqual(message);
      jest.runOnlyPendingTimers();
      await wrapper.vm.$nextTick();
    }
    expect(getPlaceholderText()).toEqual(messages[0]);
  });

  it('animates the rendered text only on hover if configured to do so', async () => {
    const { messages, wrapper, getPlaceholderText, hoverInput } = await mountTestComponent({
      animateOnlyOnHover: true
    });

    expect(getPlaceholderText()).toEqual(messages[0]);
    await hoverInput('in');
    for (const message of messages.slice(1)) {
      expect(getPlaceholderText()).toEqual(message);
      jest.runOnlyPendingTimers();
      await wrapper.vm.$nextTick();
    }
    expect(getPlaceholderText()).toEqual(messages[0]);
    jest.runOnlyPendingTimers();
    await wrapper.vm.$nextTick();
    expect(getPlaceholderText()).toEqual(messages[1]);
    await hoverInput('out');
    expect(getPlaceholderText()).toEqual(messages[0]);
    jest.advanceTimersByTime(2000);
    expect(getPlaceholderText()).toEqual(messages[0]);
    await hoverInput('in');
    expect(getPlaceholderText()).toEqual(messages[1]);
  });

  it('is not visible when there is a query set', async () => {
    const { messages, getPlaceholderText, isPlaceholderVisible, emit } = await mountTestComponent();

    expect(getPlaceholderText()).toEqual(messages[0]);
    await emit('UserAcceptedAQuery', 'testing');
    expect(isPlaceholderVisible()).toEqual(false);
    jest.advanceTimersByTime(2000);
    await emit('UserAcceptedAQuery', undefined);
    expect(getPlaceholderText()).toEqual(messages[1]);
  });

  it('is not visible when the search input is focused', async () => {
    const { wrapper, isPlaceholderVisible } = await mountTestComponent({
      autofocus: true
    });

    expect(isPlaceholderVisible()).toEqual(false);
    const inputWrapper = wrapper.findComponent(SearchInput);
    inputWrapper.trigger('blur');
    await wrapper.vm.$nextTick();
    expect(isPlaceholderVisible()).toEqual(true);
    inputWrapper.trigger('focus');
    await wrapper.vm.$nextTick();
    expect(isPlaceholderVisible()).toEqual(false);
  });
});
