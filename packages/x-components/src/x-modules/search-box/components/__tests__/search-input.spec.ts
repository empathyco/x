import { createLocalVue, shallowMount } from '@vue/test-utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../__tests__/adapter.dummy';
import SearchInput from '../search-input.vue';

describe('testing search input component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });
  const mockedSearchInput = shallowMount(SearchInput, {
    localVue
  });
  const input = mockedSearchInput.vm.$refs.input as HTMLInputElement;

  beforeEach(() => {
    jest.clearAllMocks();
    input.value = '';
  });

  it('is an XComponent', () => {
    expect(isXComponent(mockedSearchInput.vm)).toEqual(true);
  });

  it('has SearchBox as XModule', () => {
    expect(getXComponentXModuleName(mockedSearchInput.vm)).toEqual('searchBox');
  });

  it('emits UserFocusedSearchBox when it gains the focus', () => {
    const listener = jest.fn();
    mockedSearchInput.vm.$x.on('UserFocusedSearchBox').subscribe(listener);
    mockedSearchInput.trigger('focus');
    expect(listener).toHaveBeenCalled();
  });

  it('emits UserBlurredSearchBox when it loses the focus', () => {
    const listener = jest.fn();
    mockedSearchInput.vm.$x.on('UserBlurredSearchBox').subscribe(listener);
    mockedSearchInput.trigger('focus');
    mockedSearchInput.trigger('blur');
    expect(listener).toHaveBeenCalled();
  });

  it('emits UserIsTypingQuery when typing/pasting', () => {
    const listener = jest.fn();
    const queries = ['a', 'ab', 'abc'];
    mockedSearchInput.vm.$x.on('UserIsTypingAQuery').subscribe(listener);

    queries.forEach(query => {
      input.value = query;
      mockedSearchInput.trigger('input');
      expect(listener).toHaveBeenCalledWith(query);
    });
  });

  it(
    'emits UserPressedEnterKey when the query length is greater than zero and the user' +
      'pressed the enter key',
    () => {
      const listener = jest.fn();
      const query = 'water';
      mockedSearchInput.vm.$x.on('UserPressedEnterKey').subscribe(listener);

      mockedSearchInput.trigger('keydown', { key: 'Enter' });
      expect(listener).not.toHaveBeenCalled();

      input.value = query;
      mockedSearchInput.trigger('keydown', { key: 'Enter' });
      expect(listener).toHaveBeenCalledWith(query);
    }
  );

  it('has to blur the input when the event UserAcceptedAQuery is launched', () => {
    const blurListener = jest.fn();

    mockedSearchInput.vm.$x.on('UserBlurredSearchBox').subscribe(blurListener);
    input.focus();

    mockedSearchInput.vm.$x.emit('UserAcceptedAQuery', 'gusanito');

    expect(blurListener).toHaveBeenCalled();
  });
});
