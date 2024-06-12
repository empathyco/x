import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import SemanticQuery from '../semantic-query.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/index';
import { createSemanticQuery } from '../../../../__stubs__/index';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins/index';
import { RootXStoreState } from '../../../../store/store.types';
import { semanticQueriesXModule } from '../../x-module';
import { resetSemanticQueriesStateWith } from './utils';

function renderSemanticQuery({
  template = '<SemanticQuery :suggestion="suggestion" v-bind="$attrs"/>',
  suggestion = createSemanticQuery({ query: 'jeans' }),
  query = ''
} = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store, initialXModules: [semanticQueriesXModule] }, localVue);
  resetSemanticQueriesStateWith(store, { query });

  const wrapper = mount(
    {
      template,
      components: { SemanticQuery }
    },
    {
      localVue,
      store,
      data: () => ({ suggestion })
    }
  );

  return {
    wrapper: wrapper.findComponent(SemanticQuery),
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    suggestion
  } as const;
}

describe('semantic queries component', () => {
  it('is an X Component of the Semantic Queries XModule', () => {
    const { wrapper } = renderSemanticQuery();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('semanticQueries');
  });

  it('renders the SemanticQuery passed by prop', () => {
    const { wrapper } = renderSemanticQuery({
      suggestion: createSemanticQuery({ query: 'test query' })
    });

    expect(wrapper.get(getDataTestSelector('semantic-query')).element).toHaveTextContent(
      'test query'
    );
  });

  it('allows overriding its content with a slot', () => {
    const { wrapper } = renderSemanticQuery({
      template: `
        <SemanticQuery :suggestion="suggestion" #default="{ suggestion, query }">
          <span data-test="state-query">{{ query }}</span>
          <span data-test="semantic-query-content">{{ suggestion.query }}</span>
        </SemanticQuery>`,
      suggestion: createSemanticQuery({ query: 'blazer' }),
      query: 'jacket'
    });

    expect(wrapper.get(getDataTestSelector('state-query')).text()).toEqual('jacket');
    expect(wrapper.get(getDataTestSelector('semantic-query-content')).text()).toEqual('blazer');
  });

  it('emits required events on click', () => {
    const { emitSpy, wrapper, suggestion } = renderSemanticQuery();

    wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledWith(
      'UserAcceptedAQuery',
      suggestion.query,
      expect.objectContaining({
        feature: 'semantics'
      })
    );
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedASuggestion',
      suggestion,
      expect.objectContaining({
        feature: 'semantics'
      })
    );
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedASemanticQuery',
      suggestion,
      expect.objectContaining({
        feature: 'semantics'
      })
    );
  });
});
