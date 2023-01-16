import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createHistoryQuery } from '../../../../__stubs__/history-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { historyQueriesXModule } from '../../x-module';
import HistoryQuery from '../history-query.vue';
import { resetXHistoryQueriesStateWith } from './utils';

function renderHistoryQuery({
  suggestion = createHistoryQuery({ query: 'milk' }),
  query = '',
  template = '<HistoryQuery v-bind="$attrs"/>',
  removeHistoryQueryClass
}: RenderHistoryQueryOptions = {}): RenderHistoryQueryApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [historyQueriesXModule] }, localVue);
  resetXHistoryQueriesStateWith(store, { query });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        HistoryQuery
      }
    },
    {
      localVue,
      propsData: { suggestion, removeHistoryQueryClass },
      store
    }
  );

  return {
    wrapper: wrapper.findComponent(HistoryQuery),
    suggestion,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    getSuggestionWrapper() {
      return wrapper.get(getDataTestSelector('history-query'));
    },
    getRemoveWrapper() {
      return wrapper.get(getDataTestSelector('remove-history-query'));
    },
    getMatchingPart() {
      return wrapper.get(getDataTestSelector('matching-part'));
    }
  };
}

describe('testing history-query component', () => {
  it('is an XComponent that belongs to the history queries', () => {
    const { wrapper } = renderHistoryQuery();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('renders the suggestion received as prop', () => {
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' })
    });
    expect(getSuggestionWrapper().text()).toEqual('milk');
  });

  it('highlights the suggestion matching parts with the state query', () => {
    const { getSuggestionWrapper, getMatchingPart } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá'
    });

    expect(getMatchingPart().text()).toEqual('ba');
    expect(getSuggestionWrapper().text()).toEqual('baileys');
  });

  it('emits appropriate events on click', () => {
    const { emitSpy, getSuggestionWrapper, suggestion } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' })
    });

    getSuggestionWrapper().trigger('click');

    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'historyQueries',
      target: getSuggestionWrapper().element,
      feature: 'history_query'
    });
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedAHistoryQuery', suggestion, expectedMetadata);
  });

  it('allows to customise the rendered content', () => {
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      template: `
      <HistoryQuery v-bind="$attrs" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </HistoryQuery>
      `
    });

    expect(getSuggestionWrapper().text()).toEqual('🔍 baileys');
  });

  it('emits `UserPressedRemoveHistoryQuery` when `RemoveHistoryQuery` button is clicked', () => {
    const { getRemoveWrapper, emitSpy, suggestion } = renderHistoryQuery();

    getRemoveWrapper().trigger('click');
    expect(emitSpy).toHaveBeenCalledWith(
      'UserPressedRemoveHistoryQuery',
      suggestion,
      expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'historyQueries',
        target: getRemoveWrapper().element
      })
    );
  });

  it('allows to customize `RemoveHistoryQuery` button content', () => {
    const { getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'cruzcampo' }),
      template: `
      <HistoryQuery v-bind="$attrs" #remove-button-content="{ suggestion }">
        Remove {{ suggestion.query }} ❌
      </HistoryQuery>
      `
    });

    expect(getRemoveWrapper().text()).toBe('Remove cruzcampo ❌');
  });

  it('allows to add classes to the `RemoveHistoryQuery` button', () => {
    const { getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
      removeHistoryQueryClass: 'custom-class'
    });
    expect(getRemoveWrapper().classes('custom-class')).toBe(true);
  });
});

interface RenderHistoryQueryOptions {
  /** The suggestion data to render. */
  suggestion?: HistoryQueryModel;
  /** The query that the suggestions belong to. */
  query?: string;
  /** The template to render. */
  template?: string;
  /** Class to add to the node wrapping the remove history query button. */
  removeHistoryQueryClass?: string;
}

interface RenderHistoryQueryApi {
  /** Testing wrapper of the {@link HistoryQuery} component. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the suggestion wrapper of the {@link HistoryQuery} component. */
  getSuggestionWrapper: () => Wrapper<Vue>;
  /** Retrieves the remove wrapper of the {@link HistoryQuery} component. */
  getRemoveWrapper: () => Wrapper<Vue>;
  /** Retrieves the wrapper that matches the query in the {@link HistoryQuery} component. */
  getMatchingPart: () => Wrapper<Vue>;
  /** The {@link XBus.emit} spy. */
  emitSpy: jest.SpyInstance;
  /** Rendered {@link HistoryQueryModel} model data. */
  suggestion: HistoryQueryModel;
}
