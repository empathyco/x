import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
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

describe('semantic queries component', () => {
  function renderSemanticQuery({
    template = '<SemanticQuery :suggestion="suggestion" v-bind="$attrs"/>',
    suggestion = createSemanticQuery({ query: 'jeans' }),
    query = ''
  }: RenderSemanticQueryOptions = {}): RenderSemanticQueryAPI {
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
        data() {
          return {
            suggestion
          };
        }
      }
    );

    return {
      wrapper: wrapper.findComponent(SemanticQuery),
      emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
      suggestion
    };
  }

  it('is an X Component of the Semantic Queries XModule', () => {
    const { wrapper } = renderSemanticQuery();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('semanticQueries');
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
        </SemanticQuery>
      `,
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

/**
 * The options to render the {@link SemanticQuery} component.
 */
interface RenderSemanticQueryOptions {
  /* The template to render the component. */
  template?: string;
  /* The semantic query to render. */
  suggestion?: SemanticQueryModel;
  /* The query from the semantic queries state. */
  query?: string;
}

/**
 * The API to test the {@link SemanticQuery} component.
 */
interface RenderSemanticQueryAPI {
  /* The testing wrapper of the {@link SemanticQuery} component. */
  wrapper: Wrapper<Vue>;
  /* A jest spy of the X emit method. */
  emitSpy: ReturnType<typeof jest.spyOn>;
  /* The rendered semantic query. */
  suggestion: SemanticQueryModel;
}
