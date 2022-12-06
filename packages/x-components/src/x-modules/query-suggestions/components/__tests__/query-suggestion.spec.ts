import { Suggestion } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { querySuggestionsXModule } from '../../x-module';
import QuerySuggestion from '../query-suggestion.vue';
import { resetXQuerySuggestionsStateWith } from './utils';

function renderQuerySuggestion({
  suggestion = createQuerySuggestion('baileys'),
  query = '',
  template = '<QuerySuggestion v-bind="$attrs"/>'
}: RenderQuerySuggestionOptions = {}): RenderQuerySuggestionApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] }, localVue);
  resetXQuerySuggestionsStateWith(store, { query });

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        QuerySuggestion
      }
    },
    {
      localVue,
      propsData: { suggestion },
      store
    }
  );

  return {
    wrapper: wrapper.findComponent(QuerySuggestion),
    suggestion,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    getMatchingPart() {
      return wrapper.get(getDataTestSelector('matching-part'));
    }
  };
}

describe('testing query-suggestion component', () => {
  it('is an XComponent that belongs to the query suggestions', () => {
    const { wrapper } = renderQuerySuggestion();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('querySuggestions');
  });

  it('renders the suggestion received as prop', () => {
    const { wrapper } = renderQuerySuggestion({
      suggestion: createQuerySuggestion('milk')
    });
    expect(wrapper.text()).toEqual('milk');
  });

  it('highlights the suggestion matching parts with the state query', () => {
    const { wrapper, getMatchingPart } = renderQuerySuggestion({
      suggestion: createQuerySuggestion('baileys'),
      query: 'Bá'
    });

    expect(getMatchingPart().text()).toEqual('ba');
    expect(wrapper.text()).toEqual('baileys');
  });

  it('emits appropriate events on click', () => {
    const { wrapper, emitSpy, suggestion } = renderQuerySuggestion({
      suggestion: createQuerySuggestion('milk')
    });

    wrapper.trigger('click');

    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'querySuggestions',
      target: wrapper.element,
      feature: 'query_suggestion'
    });
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedAQuerySuggestion',
      suggestion,
      expectedMetadata
    );
  });

  it('allows to customise the rendered content', () => {
    const { wrapper } = renderQuerySuggestion({
      suggestion: createQuerySuggestion('baileys'),
      template: `
      <QuerySuggestion v-bind="$attrs" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </QuerySuggestion>
      `
    });

    expect(wrapper.text()).toEqual('🔍 baileys');
  });
});

interface RenderQuerySuggestionOptions {
  /** The suggestion data to render. */
  suggestion?: Suggestion;
  /** The query that the suggestions belong to. */
  query?: string;
  /** The template to render. */
  template?: string;
}

interface RenderQuerySuggestionApi {
  /** Testing wrapper of the {@link QuerySuggestion} component. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the wrapper that matches the query in the {@link QuerySuggestion} component. */
  getMatchingPart: () => Wrapper<Vue>;
  /** The {@link XBus.emit} spy. */
  emitSpy: jest.SpyInstance;
  /** Rendered {@link Suggestion} model data. */
  suggestion: Suggestion;
}
