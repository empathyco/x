import { Wrapper, mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils/src/types/utils.types';
import { SemanticQuery } from '@empathyco/x-types';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import SemanticQueries from '../semantic-queries.vue';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/store.types';
import { createSemanticQuery } from '../../../../__stubs__/semantic-queries-stubs.factory';
import { resetSemanticQueriesStateWith } from './utils';

function renderSemanticQueriesList({
  template = `
    <SemanticQueries/>
  `,
  semanticQueries = [
    createSemanticQuery({ query: 'test', distance: 1 }),
    createSemanticQuery({ query: 'test 2', distance: 2 })
  ],
  threshold = 5
}: RenderSemanticQueriesListOptions = {}): RenderSemanticQueriesListAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin(
    {
      store,
      xModules: {
        semanticQueries: {
          config: {
            threshold
          }
        }
      }
    },
    localVue
  );
  resetSemanticQueriesStateWith(store, { semanticQueries });

  const wrapper = mount(
    {
      template,
      components: {
        SemanticQueries
      }
    },
    {
      localVue,
      store
    }
  );

  return { wrapper: wrapper.findComponent(SemanticQueries) };
}

describe('testing SemanticQueries', () => {
  it('is an X Component that belongs to the semantic queries module', () => {
    const { wrapper } = renderSemanticQueriesList();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('semanticQueries');
  });

  it('wont render if there are no semantic queries', () => {
    const { wrapper } = renderSemanticQueriesList({
      semanticQueries: []
    });

    expect(wrapper.html()).toEqual('');
  });

  it('renders a list with the semantic queries from the state', () => {
    const { wrapper } = renderSemanticQueriesList({
      semanticQueries: [
        createSemanticQuery({ query: 'test', distance: 1 }),
        createSemanticQuery({ query: 'test 2', distance: 2 })
      ]
    });

    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query')).wrappers;

    expect(wrappers).toHaveLength(2);
    expect(wrappers.at(0)?.text()).toEqual('test - 1');
    expect(wrappers.at(1)?.text()).toEqual('test 2 - 2');
  });

  it('exposes a slot to overwrite the whole list', () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #default="{ queries }">
          <div>
            <span v-for="query in queries" :key="query" data-test="semantic-query">
              {{ query }}
            </span>
          </div>
        </SemanticQueries>`,
      semanticQueries: [
        createSemanticQuery({ query: 'test 1' }),
        createSemanticQuery({ query: 'test 2' })
      ]
    });

    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query')).wrappers;

    expect(wrappers).toHaveLength(2);
    expect(wrappers.at(0)?.text()).toEqual('test 1');
    expect(wrappers.at(1)?.text()).toEqual('test 2');
  });

  it('exposes a slot to overwrite the item', () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #item="{ query }">
          <span data-test="semantic-query-item-content">
            {{ query.query }} - {{ query.distance }}
          </span>
        </SemanticQueries>`,
      semanticQueries: [
        createSemanticQuery({ query: 'test 1', distance: 1 }),
        createSemanticQuery({ query: 'test 2', distance: 2 })
      ]
    });

    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query-item-content')).wrappers;

    expect(wrappers).toHaveLength(2);
    expect(wrappers.at(0)?.text()).toEqual('test 1 - 1');
    expect(wrappers.at(1)?.text()).toEqual('test 2 - 2');
  });
});

/**
 * The options to render the {@link SemanticQueries} component.
 */
interface RenderSemanticQueriesListOptions {
  /* The template to render the component. */
  template?: string;
  /* The semantic queries to render. */
  semanticQueries?: SemanticQuery[];
  /* The max number of results to show the semantic queries. */
  threshold?: number;
}

/**
 * The API to test the {@link SemanticQueries} component.
 */
interface RenderSemanticQueriesListAPI {
  /* The testing wrapper of the {@link SemanticQueries) component. */
  wrapper: Wrapper<Vue>;
}
