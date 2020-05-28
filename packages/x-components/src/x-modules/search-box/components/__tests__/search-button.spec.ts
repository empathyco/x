import { createLocalVue, mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import SearchButton from '../search-button.vue';
import { resetXSearchBoxStateWith } from './utils';

describe('testing search button component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  const searchButtonWrapper = mount(SearchButton, {
    localVue,
    store,
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
  });

  it('renders search button with inner svg icon', () => {
    const htmlIcon =
      '<svg height="10" width="10"><circle cx="5" cy="5" r="4" stroke="black"></circle></svg>';

    const searchIconButtonWrapper = mount(SearchButton, {
      localVue,
      store,
      slots: { default: htmlIcon }
    });

    const renderedHtmlIcon = searchIconButtonWrapper.element.innerHTML;
    expect(renderedHtmlIcon).toEqual(htmlIcon);
  });

  it("doesn't emit events if the query is empty", async () => {
    const mockedObserver = jest.fn();
    searchButtonWrapper.vm.$x.on('UserAcceptedAQuery').subscribe(mockedObserver);
    searchButtonWrapper.vm.$x.on('UserPressedSearchButton').subscribe(mockedObserver);

    resetXSearchBoxStateWith(store, { query: '' });

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

    resetXSearchBoxStateWith(store, { query });

    await Vue.nextTick();

    searchButtonWrapper.trigger('click');

    expect(mockedObserver).toHaveBeenCalledTimes(2);
    expect(mockedObserver).toHaveBeenNthCalledWith(1, mockedObserverCalledWith);
    expect(mockedObserver).toHaveBeenNthCalledWith(2, mockedObserverCalledWith);
  });
});
