import { mount, Wrapper } from '@vue/test-utils';

import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components';
import { XPlugin } from '../../../../plugins';
import { XEvent } from '../../../../wiring';
import { searchBoxXModule } from '../../x-module';
import SearchInput from '../search-input.vue';
import SearchInputPlaceholder from '../search-input-placeholder.vue';

async function mountTestComponent({
  propsData,
  slots
}: TestComponentParams = {}): Promise<TestComponentAPI> {
  const defaultMessages = ['Find sunglasses', 'Find handbags', 'Find earrings'];

  const [, localVue] = installNewXPlugin();
  XPlugin.registerXModule(searchBoxXModule);

  const parent = document.createElement('div');
  document.body.appendChild(parent);

  propsData = Object.assign({ placeholder: {}, input: {} }, propsData);
  propsData.placeholder!.messages = propsData.placeholder!.messages ?? defaultMessages;
  propsData.input!.autofocus = propsData.input!.autofocus ?? false;

  const wrapper = mount(
    {
      template: `
        <div>
        <SearchInputPlaceholder v-bind="placeholder">
          <slot/>
        </SearchInputPlaceholder>
        <SearchInput v-bind="input"/>
        </div>
      `,
      props: ['placeholder', 'input'],
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
        ...propsData
      },
      slots: {
        ...slots
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
    defaultMessages,
    wrapper,
    getPlaceholderText,
    isPlaceholderVisible,
    hoverInput,
    emit
  };
}

interface TestComponentParams {
  propsData?: {
    placeholder?: Partial<SearchInputPlaceholderProps>;
    input?: SearchInputProps;
  };
  slots?: SearchInputPlaceholderSlots;
}

interface SearchInputPlaceholderProps {
  messages: Array<string>;
  animationIntervalMs?: number;
  animateOnlyOnHover?: boolean;
}

interface SearchInputProps {
  autofocus?: boolean;
}

interface SearchInputPlaceholderSlots {
  default?: string;
}

interface TestComponentAPI {
  defaultMessages: Array<string>;
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
    const { defaultMessages, wrapper, getPlaceholderText } = await mountTestComponent();

    for (const message of defaultMessages) {
      expect(getPlaceholderText()).toEqual(message);
      jest.runOnlyPendingTimers();
      await wrapper.vm.$nextTick();
    }
    expect(getPlaceholderText()).toEqual(defaultMessages[0]);
  });

  it('animates the rendered text only on hover if configured to do so', async () => {
    const slotContent = 'Search';
    const { defaultMessages, wrapper, getPlaceholderText, hoverInput } = await mountTestComponent({
      propsData: {
        placeholder: {
          animateOnlyOnHover: true
        }
      },
      slots: {
        default: `<template>${slotContent}</template>`
      }
    });

    expect(getPlaceholderText()).toEqual(slotContent);
    await hoverInput('in');
    for (const message of defaultMessages) {
      expect(getPlaceholderText()).toEqual(message);
      jest.runOnlyPendingTimers();
      await wrapper.vm.$nextTick();
    }
    expect(getPlaceholderText()).toEqual(defaultMessages[0]);
    await hoverInput('out');
    expect(getPlaceholderText()).toEqual(slotContent);
    jest.advanceTimersByTime(2000);
    expect(getPlaceholderText()).toEqual(slotContent);
    await hoverInput('in');
    expect(getPlaceholderText()).toEqual(defaultMessages[1]);
  });

  it('is not visible when there is a query set', async () => {
    const { defaultMessages, getPlaceholderText, isPlaceholderVisible, emit } =
      await mountTestComponent();

    expect(getPlaceholderText()).toEqual(defaultMessages[0]);
    await emit('UserAcceptedAQuery', 'testing');
    expect(isPlaceholderVisible()).toEqual(false);
    jest.advanceTimersByTime(2000);
    await emit('UserAcceptedAQuery', undefined);
    expect(getPlaceholderText()).toEqual(defaultMessages[1]);
  });

  it('is not visible when the search input is focused', async () => {
    const { wrapper, isPlaceholderVisible } = await mountTestComponent({
      propsData: {
        input: {
          autofocus: true
        }
      }
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
