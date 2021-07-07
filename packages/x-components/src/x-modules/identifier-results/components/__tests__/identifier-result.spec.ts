import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { IdentifierResult } from '../index';
import { resetStoreIdentifierResultState } from './utils';

describe('testing IdentifierResult component', () => {
  const result = getResultsStub()[0];

  let identifierResultWrapper: Wrapper<IdentifierResult>;

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    identifierResultWrapper = mount(IdentifierResult, {
      localVue,
      store,
      propsData: { result }
    });
  });

  it('is an XComponent and has an XModule', () => {
    expect(isXComponent(identifierResultWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(identifierResultWrapper.vm)).toBe('identifierResults');
  });

  it('highlights the part of the identifier that matches the query', async () => {
    resetStoreIdentifierResultState(store, { query: 'A02232' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">A022/32</span>34'
    );
  });

  it('highlights the part of the identifier that matches the query in different case', async () => {
    resetStoreIdentifierResultState(store, { query: 'a02232' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">A022/32</span>34'
    );
  });

  it("doesn't render the identifier when there's no query", async () => {
    resetStoreIdentifierResultState(store, { query: '' });
    await localVue.nextTick();

    expect(identifierResultWrapper.html()).toEqual('');
  });

  // eslint-disable-next-line max-len
  it('highlights the part of the identifier  that matches the query with optional character', async () => {
    resetStoreIdentifierResultState(store, { query: 'A022/32' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">A022/32</span>34'
    );
  });

  // eslint-disable-next-line max-len
  it('highlights the part of the identifier that matches the query ignoring whitespaces', async () => {
    resetStoreIdentifierResultState(store, { query: 'A 0 22 /3 2' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">A022/32</span>34'
    );
  });

  // eslint-disable-next-line max-len
  it('highlights the part of the identifier that matches the query ignoring extra separators', async () => {
    resetStoreIdentifierResultState(store, { query: 'A/0/22/32' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">A022/32</span>34'
    );
  });

  it("doesn't highlight if there is no match with the input query", async () => {
    resetStoreIdentifierResultState(store, { query: 'B022/32' });
    await localVue.nextTick();

    expect(getIdentifierResultSpanHtml()).toEqual('A022/3234');
  });

  function getIdentifierResultSpanHtml(): string {
    return identifierResultWrapper.find(getDataTestSelector('identifier-result')).element.innerHTML;
  }
});
