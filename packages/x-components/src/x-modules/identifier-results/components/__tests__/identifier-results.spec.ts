import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { BaseResultLink } from '../../../../components/index';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import IdentifierResults from '../identifier-results.vue';
import { IdentifierResult } from '../index';
import { resetStoreIdentifierResultState } from './utils';

describe('testing IdentifierResult component', () => {
  const identifierResults = getResultsStub();

  let identifierResultsWrapper: Wrapper<IdentifierResults>;

  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  beforeEach(() => {
    identifierResultsWrapper = mount(IdentifierResults, { localVue, store });
    resetStoreIdentifierResultState(store, { query: 'A02232', identifierResults });
  });

  it('is an XComponent which has an XModule', () => {
    expect(isXComponent(identifierResultsWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(identifierResultsWrapper.vm)).toBe('identifierResults');
  });

  it('renders a list of IdentifierResult wrapped by a BaseResultLink', () => {
    const wrapperComponent = {
      template: `
        <IdentifierResults>
          <template #default="{ identifierResult }">
            <BaseResultLink :result="identifierResult">
              <template #default="{ result }">
                <IdentifierResult :result="result" />
              </template>
            </BaseResultLink>
          </template>
        </IdentifierResults>
      `,
      components: {
        BaseResultLink,
        IdentifierResult,
        IdentifierResults
      }
    };

    identifierResultsWrapper = mount(wrapperComponent, {
      localVue,
      store
    });

    expect(identifierResultsWrapper.findComponent(BaseResultLink)).toBeDefined();

    const spanList = findAllByTestDataId(identifierResultsWrapper, 'identifier-result');

    identifierResults.forEach((result, index) => {
      expect(spanList.at(index).text()).toEqual(result.identifier!.value);
    });
  });

  it('does not render any IdentifierResult if the are none', async () => {
    resetStoreIdentifierResultState(store);

    await localVue.nextTick();

    expect(identifierResultsWrapper.html()).toEqual('');
  });

  it('allows changing the animation with a transition group', async () => {
    const animation = Vue.extend({
      render(h) {
        return h(
          'transition-group',
          {
            attrs: {
              ...this.$attrs,
              ['data-test']: 'test-animation'
            }
          },
          this.$slots.default
        );
      }
    });

    await identifierResultsWrapper.setProps({ animation });

    expect(identifierResultsWrapper.findComponent(animation).exists()).toBeTruthy();
    expect(identifierResultsWrapper.find('test-animation')).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  it('renders at most the number of identifier results defined by `maxItemsToRender` prop', async () => {
    const renderedResults = (): WrapperArray<Vue> =>
      findAllByTestDataId(identifierResultsWrapper, 'identifier-results-item');

    expect(renderedResults()).toHaveLength(identifierResults.length);

    await identifierResultsWrapper.setProps({ maxItemsToRender: identifierResults.length - 1 });
    expect(renderedResults()).toHaveLength(identifierResults.length - 1);

    await identifierResultsWrapper.setProps({ maxItemsToRender: identifierResults.length });
    expect(renderedResults()).toHaveLength(identifierResults.length);

    await identifierResultsWrapper.setProps({ maxItemsToRender: identifierResults.length + 1 });
    expect(renderedResults()).toHaveLength(identifierResults.length);
  });

  function findAllByTestDataId(wrapper: Wrapper<Vue>, testDataId: string): WrapperArray<Vue> {
    return wrapper.findAll(getDataTestSelector(testDataId));
  }
});
