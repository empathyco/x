import { Suggestion } from '@empathyco/x-types';
import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { createPopularSearch } from '../../../../__stubs__/popular-searches-stubs.factory';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { popularSearchesXModule } from '../../x-module';
import PopularSearch from '../popular-search.vue';

function renderPopularSearch({
  suggestion = createPopularSearch('baileys'),
  template = '<PopularSearch v-bind="$attrs"/>'
}: RenderPopularSearchOptions = {}): RenderPopularSearchApi {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store, initialXModules: [popularSearchesXModule] }, localVue);

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        PopularSearch
      }
    },
    {
      localVue,
      propsData: { suggestion },
      store
    }
  );

  return {
    wrapper: wrapper.findComponent(PopularSearch),
    suggestion,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit')
  };
}

describe('testing popular-search component', () => {
  it('is an XComponent that belongs to the popular searches', () => {
    const { wrapper } = renderPopularSearch();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('popularSearches');
  });

  it('renders the suggestion received as prop', () => {
    const { wrapper } = renderPopularSearch({
      suggestion: createPopularSearch('milk')
    });
    expect(wrapper.text()).toEqual('milk');
  });

  it('emits appropriate events on click', () => {
    const { wrapper, emitSpy, suggestion } = renderPopularSearch({
      suggestion: createPopularSearch('milk')
    });

    wrapper.trigger('click');

    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'popularSearches',
      target: wrapper.element,
      feature: 'popular_search'
    });
    expect(emitSpy).toHaveBeenCalledTimes(3);
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata);
    expect(emitSpy).toHaveBeenCalledWith(
      'UserSelectedAPopularSearch',
      suggestion,
      expectedMetadata
    );
  });

  it('allows to customise the rendered content', () => {
    const { wrapper } = renderPopularSearch({
      suggestion: createPopularSearch('baileys'),
      template: `
      <PopularSearch v-bind="$attrs" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </PopularSearch>
      `
    });

    expect(wrapper.text()).toEqual('🔍 baileys');
  });
});

interface RenderPopularSearchOptions {
  /** The suggestion data to render. */
  suggestion?: Suggestion;
  /** The template to render. */
  template?: string;
}

interface RenderPopularSearchApi {
  /** Testing wrapper of the {@link PopularSearch} component. */
  wrapper: Wrapper<Vue>;
  /** The {@link XBus.emit} spy. */
  emitSpy: jest.SpyInstance;
  /** Rendered {@link Suggestion} model data. */
  suggestion: Suggestion;
}
