import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createQuerySuggestion } from '../../../../__stubs__/query-suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { querySuggestionsXModule } from '../../x-module';
import QuerySuggestion from '../query-suggestion.vue';
import { XPlugin } from '../../../../plugins/index';
import { resetXQuerySuggestionsStateWith } from './utils';

function renderQuerySuggestion({
  suggestion = createQuerySuggestion('baileys'),
  query = '',
  template = '<QuerySuggestion :suggestion="suggestion"/>'
} = {}) {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});

  installNewXPlugin({ store, initialXModules: [querySuggestionsXModule] }, localVue);
  resetXQuerySuggestionsStateWith(store, { query });

  const wrapper = mount(
    {
      template,
      components: { QuerySuggestion },
      props: ['suggestion']
    },
    {
      localVue,
      store,
      propsData: { suggestion }
    }
  );

  return {
    wrapper: wrapper.findComponent(QuerySuggestion),
    suggestion,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    getMatchingPart: () => wrapper.get(getDataTestSelector('matching-part'))
  } as const;
}

describe('testing query-suggestion component', () => {
  it('is an XComponent that belongs to the query suggestions', () => {
    const { wrapper } = renderQuerySuggestion();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
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
      <QuerySuggestion :suggestion="suggestion" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </QuerySuggestion>`
    });

    expect(wrapper.text()).toEqual('🔍 baileys');
  });
});
