import { createLocalVue, mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import { isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { DEFAULT_X_CONFIG } from '../../../../plugins/x-plugin.config';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import SearchButton from '../search-button.vue';

describe('testing search button component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

  const searchButtonWrapper = mount(SearchButton, {
    localVue,
    slots: { default: 'Search!' }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is an XComponent', () => {
    expect(isXComponent(searchButtonWrapper.vm)).toEqual(true);
  });

  it('renders search button with inner text', () => {
    expect(searchButtonWrapper.text()).toEqual('Search!');
    expect(searchButtonWrapper.element.getAttribute('aria-label')).toEqual(
      DEFAULT_X_CONFIG.messages.searchBox.searchButton.ariaLabel
    );
  });

  it('renders search button with inner svg icon', () => {
    const htmlIcon =
      '<svg height="10" width="10"><circle cx="5" cy="5" r="4" stroke="black"></circle></svg>';

    const searchIconButtonWrapper = mount(SearchButton, {
      localVue,
      slots: { default: htmlIcon }
    });

    const renderedHtmlIcon = searchIconButtonWrapper.element.innerHTML;
    expect(renderedHtmlIcon).toEqual(htmlIcon);
  });

  it("doesn't emit events if the query is empty", async () => {
    const mockedObserver = jest.fn();
    searchButtonWrapper.vm.$x.on('UserAcceptedAQuery').subscribe(mockedObserver);
    searchButtonWrapper.vm.$x.on('UserPressedSearchButton').subscribe(mockedObserver);

    searchButtonWrapper.vm.$store.commit('x/searchBox/setQuery', '');

    await Vue.nextTick();

    searchButtonWrapper.trigger('click');

    expect(mockedObserver).not.toHaveBeenCalled();
  });

  it('emits events if the query is not empty', async () => {
    const query = 'honda crf';
    const mockedObserver = jest.fn();
    const mockedObserverCalledWith = {
      eventPayload: query,
      metadata: {
        moduleName: 'searchBox',
        target: searchButtonWrapper.element
      }
    };
    searchButtonWrapper.vm.$x.on('UserAcceptedAQuery', true).subscribe(mockedObserver);
    searchButtonWrapper.vm.$x.on('UserPressedSearchButton', true).subscribe(mockedObserver);

    searchButtonWrapper.vm.$store.commit('x/searchBox/setQuery', query);

    await Vue.nextTick();

    searchButtonWrapper.trigger('click');

    expect(mockedObserver).toHaveBeenCalledTimes(2);
    expect(mockedObserver).toHaveBeenNthCalledWith(1, mockedObserverCalledWith);
    expect(mockedObserver).toHaveBeenNthCalledWith(2, mockedObserverCalledWith);
  });
});
