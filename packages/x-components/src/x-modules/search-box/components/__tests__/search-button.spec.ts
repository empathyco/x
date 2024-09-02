import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { WireMetadata } from '../../../../wiring/wiring.types';
import SearchButton from '../search-button.vue';
import { XPlugin } from '../../../../plugins/index';
import { searchBoxXModule } from '../../x-module';
import { resetXSearchBoxStateWith } from './utils';

function renderSearchButton(slotContent: string) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(SearchButton, {
    slots: { default: slotContent },
    global: {
      plugins: [store, installNewXPlugin({ initialXModules: [searchBoxXModule], store })]
    }
  });

  XPlugin.registerXModule(searchBoxXModule);
  const mockedObserver = jest.fn();
  XPlugin.bus.on('UserAcceptedAQuery', true).subscribe(mockedObserver);
  XPlugin.bus.on('UserPressedSearchButton', true).subscribe(mockedObserver);

  return {
    wrapper,
    store,
    mockedObserver
  };
}

describe('testing search button component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is an XComponent', () => {
    const { wrapper } = renderSearchButton('Search!');
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('renders search button with inner text', () => {
    const { wrapper } = renderSearchButton('Search!');
    expect(wrapper.text()).toEqual('Search!');
  });

  it('renders search button with inner svg icon', () => {
    const htmlIcon = `<svg height="10" width="10"><circle cx="5" cy="5" r="4" stroke="black"></circle></svg>`;
    const { wrapper } = renderSearchButton(htmlIcon);
    const renderedHtmlIcon = wrapper.element.innerHTML;
    expect(renderedHtmlIcon).toContain(htmlIcon);
  });

  it("doesn't emit events if the query is empty", async () => {
    const { mockedObserver, store, wrapper } = renderSearchButton('Search!');
    resetXSearchBoxStateWith(store, { query: '' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await nextTick();
    await wrapper.trigger('click');

    expect(mockedObserver).not.toHaveBeenCalled();
  });

  it('emits events if the query is not empty', async () => {
    const { mockedObserver, store, wrapper } = renderSearchButton('Search!');
    const query = 'honda crf';
    const mockedObserverCalledWith = {
      eventPayload: query,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'searchBox',
        target: wrapper.element,
        feature: 'search_box'
      })
    };
    resetXSearchBoxStateWith(store, { query });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await nextTick();
    await wrapper.trigger('click');

    expect(mockedObserver).toHaveBeenCalledTimes(2);
    expect(mockedObserver).toHaveBeenNthCalledWith(1, mockedObserverCalledWith);
    expect(mockedObserver).toHaveBeenNthCalledWith(2, mockedObserverCalledWith);
  });
});
