import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { installNewXPlugin } from '../../../../__tests__/utils';
import SearchInput from '../search-input.vue';
import { resetXSearchBoxStateWith } from './utils';

describe('testing search input component', () => {
  let store: Store<DeepPartial<RootXStoreState>>;
  let mockedSearchInput: Wrapper<SearchInput>;
  let input: HTMLInputElement;
  const listener = jest.fn();

  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuex);
    store = new Store<DeepPartial<RootXStoreState>>({});
    installNewXPlugin({ store }, localVue);
    resetXSearchBoxStateWith(store);

    mockedSearchInput = mount(SearchInput, {
      store,
      localVue
    });
    input = mockedSearchInput.vm.$refs.input as HTMLInputElement;

    jest.clearAllMocks();
  });

  it('is an XComponent', () => {
    expect(isXComponent(mockedSearchInput.vm)).toEqual(true);
  });

  it('has SearchBox as XModule', () => {
    expect(getXComponentXModuleName(mockedSearchInput.vm)).toEqual('searchBox');
  });

  it('emits UserFocusedSearchBox when it gains the focus', () => {
    mockedSearchInput.vm.$x.on('UserFocusedSearchBox').subscribe(listener);
    mockedSearchInput.trigger('focus');
    expect(listener).toHaveBeenCalled();
  });

  it('emits UserBlurredSearchBox when it loses the focus', () => {
    mockedSearchInput.vm.$x.on('UserBlurredSearchBox').subscribe(listener);
    mockedSearchInput.trigger('focus');
    mockedSearchInput.trigger('blur');
    expect(listener).toHaveBeenCalled();
  });

  it('emits UserIsTypingQuery when typing/pasting', () => {
    const queries = ['a', 'ab', 'abc'];
    mockedSearchInput.vm.$x.on('UserIsTypingAQuery').subscribe(listener);

    queries.forEach(query => {
      input.value = query;
      mockedSearchInput.trigger('input');
      expect(listener).toHaveBeenCalledWith(query);
    });
  });

  it(
    'emits UserAcceptedAQuery event when typing/pasting if config.instant is true and ' +
      'after the config.instantDebounceInMs timeout',
    () => {
      mockedSearchInput.setProps({ instant: true, instantDebounceInMs: 100 });

      const query = 'pulpo';
      mockedSearchInput.vm.$x.on('UserAcceptedAQuery').subscribe(listener);

      input.value = query;
      mockedSearchInput.trigger('input');
      jest.advanceTimersByTime(100);
      expect(listener).toHaveBeenCalledWith(query);
    }
  );

  it('emits UserClearedQuery when typing/cutting the search-box is cleared', () => {
    const queryClearedListener = jest.fn();
    const queries = ['a', '', 'abc', ''];
    mockedSearchInput.vm.$x.on('UserClearedQuery').subscribe(queryClearedListener);

    queries.forEach(query => {
      input.value = query;
      mockedSearchInput.trigger('input');
      if (!query) {
        expect(queryClearedListener).toHaveBeenCalled();
      }
    });
    expect(queryClearedListener).toHaveBeenCalledTimes(2);
  });

  it(
    'emits UserPressedEnterKey and UserAcceptedAQuery events when the query length is ' +
      'greater than zero and the user pressed the enter key',
    () => {
      const enterListener = jest.fn();
      const acceptedQueryListener = jest.fn();
      const query = 'water';
      mockedSearchInput.vm.$x.on('UserPressedEnterKey').subscribe(enterListener);
      mockedSearchInput.vm.$x.on('UserAcceptedAQuery').subscribe(acceptedQueryListener);

      mockedSearchInput.trigger('keydown.enter');
      expect(enterListener).not.toHaveBeenCalled();
      expect(acceptedQueryListener).not.toHaveBeenCalled();

      input.value = query;
      mockedSearchInput.trigger('keydown.enter');
      expect(enterListener).toHaveBeenCalledWith(query);
      expect(acceptedQueryListener).toHaveBeenCalledWith(query);
    }
  );
});
