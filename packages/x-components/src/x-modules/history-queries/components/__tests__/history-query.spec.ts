import { HistoryQuery as HistoryQueryModel } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { mount } from '@vue/test-utils';
import { Store } from 'vuex';
import { nextTick } from 'vue';
import { createHistoryQuery } from '../../../../__stubs__/history-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { historyQueriesXModule } from '../../x-module';
import HistoryQuery from '../history-query.vue';
import { XPlugin } from '../../../../plugins/index';
import { resetXHistoryQueriesStateWith } from './utils';

function renderHistoryQuery({
  suggestion = createHistoryQuery({ query: 'milk' }),
  query = '',
  template = '<HistoryQuery v-bind="$attrs"/>',
  removeButtonClass,
  suggestionClass,
  wrapperComponentOptions
}: RenderHistoryQueryOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({});

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        HistoryQuery
      },
      ...wrapperComponentOptions
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })]
      },
      props: { suggestion, removeButtonClass, suggestionClass },
      store
    }
  );

  resetXHistoryQueriesStateWith(store, { query });

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is an XComponent that belongs to the history queries', () => {
    const { wrapper } = renderHistoryQuery();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries');
  });

  it('renders the suggestion received as prop', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' })
    });
    expect(getSuggestionWrapper().text()).toEqual('milk');
  });

  it('highlights the suggestion matching parts with the state query', async () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getSuggestionWrapper, getMatchingPart } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá'
    });

    await nextTick();

    expect(getMatchingPart().text()).toEqual('ba');
    expect(getSuggestionWrapper().text()).toEqual('baileys');
  });

  it('emits appropriate events on click', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { emitSpy, getSuggestionWrapper, suggestion } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' })
    });

    getSuggestionWrapper().trigger('click');
    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'historyQueries',
      target: getSuggestionWrapper().element as HTMLElement,
      feature: 'history_query'
    });
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedAHistoryQuery', suggestion, expectedMetadata);
  });

  it('allows to customise the rendered content', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      template: `
      <HistoryQuery v-bind="$attrs" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </HistoryQuery>
      `
    });

    expect(getSuggestionWrapper().text()).toEqual('🔍baileys');
  });

  // TODO: Enable test when BaseEventButton component is migrated
  // eslint-disable-next-line jest/no-disabled-tests,max-len
  it.skip('emits `UserPressedRemoveHistoryQuery` when `RemoveHistoryQuery` button is clicked', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { emitSpy, suggestion, getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' })
    });

    getRemoveWrapper().trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      'UserPressedRemoveHistoryQuery',
      suggestion,
      expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'historyQueries',
        target: getRemoveWrapper().element as HTMLElement
      })
    );
  });

  it('allows to customize `RemoveHistoryQuery` button content', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
      removeButtonClass: 'custom-class'
    });
    expect(getRemoveWrapper().classes('custom-class')).toBe(true);
  });

  it('allows to add classes to the `HistoryQuerySuggestion` button', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
      suggestionClass: 'custom-class'
    });
    expect(getSuggestionWrapper().classes('custom-class')).toBe(true);
  });

  it('emits click event', () => {
    const suggestion = createHistoryQuery({ query: 'baileys' });
    const handleClick = jest.fn();

    const { wrapper } = renderHistoryQuery({
      suggestion,
      template: `
        <HistoryQuery v-bind="$attrs" @click="handleClick"/>
      `,
      wrapperComponentOptions: {
        methods: {
          handleClick
        }
      }
    });

    wrapper.get(getDataTestSelector('history-query')).trigger('click');
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(suggestion, expect.any(MouseEvent));
  });
});

interface RenderHistoryQueryOptions {
  /** Options to pass to the wrapper component. */
  wrapperComponentOptions?: any;
  /** The suggestion data to render. */
  suggestion?: HistoryQueryModel;
  /** The query that the suggestions belong to. */
  query?: string;
  /** The template to render. */
  template?: string;
  /** Class to add to the node wrapping the remove history query button. */
  removeButtonClass?: string;
  /** Class to add to the node wrapping the history query suggestion button. */
  suggestionClass?: string;
}
