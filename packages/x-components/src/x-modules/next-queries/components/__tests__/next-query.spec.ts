import { mount, Wrapper } from '@vue/test-utils';
import { NextQuery } from '@empathyco/x-types';
import { createNextQueryStub } from '../../../../__stubs__/next-queries-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { WireMetadata } from '../../../../wiring/wiring.types';
import { default as NextQueryComponent } from '../next-query.vue';
import { XPlugin } from '../../../../plugins/index';

function renderNextQuery({
  suggestion = createNextQueryStub('milk'),
  template = '<NextQuery :suggestion="suggestion" />'
}: RenderNextQueryOptions = {}): RenderNextQueryAPI {
  const [, localVue] = installNewXPlugin();
  const wrapperTemplate = mount(
    {
      props: ['suggestion', 'highlightCurated'],
      components: {
        NextQuery: NextQueryComponent
      },
      template
    },
    {
      localVue,
      propsData: { suggestion }
    }
  );
  const wrapper = wrapperTemplate.findComponent(NextQueryComponent);

  return {
    wrapper,
    suggestion,
    async clickNextQuery() {
      wrapper.trigger('click');
      await localVue.nextTick();
    },
    hasIsCuratedClass() {
      return wrapper
        .find(getDataTestSelector('next-query'))
        .element.classList.contains('x-next-query--is-curated');
    }
  };
}

describe('testing next query item component', () => {
  it('is an XComponent and has an XModule', () => {
    const { wrapper } = renderNextQuery();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('nextQueries');
  });

  it('emits UserSelectedANextQuery when a next query is selected', async () => {
    const { clickNextQuery, suggestion, wrapper } = renderNextQuery();
    const listener = jest.fn();
    XPlugin.bus.on('UserSelectedANextQuery', true).subscribe(listener);

    await clickNextQuery();

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith({
      eventPayload: suggestion,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'nextQueries',
        target: wrapper.element,
        feature: 'next_query'
      })
    });
  });

  it('renders a button with the query of the next query (suggestion)', () => {
    const { wrapper, suggestion } = renderNextQuery();
    const nextQuerySuggestion = wrapper.find(getDataTestSelector('next-query'));
    expect(nextQuerySuggestion.text()).toEqual(suggestion.query);
  });

  it('renders a button overriding the default content', () => {
    const template = `
        <NextQuery :suggestion="suggestion">
          <template #default="{ suggestion }">
            <img data-test="next-query-icon" src="./next-query.svg"/>
            <span data-test="next-query-query" :aria-label="suggestion.query">
                  {{ suggestion.query }}
                </span>
          </template>
        </NextQuery>
      `;

    const { wrapper, suggestion } = renderNextQuery({
      template
    });

    expect(wrapper.find(getDataTestSelector('next-query')).element).toBeDefined();
    expect(wrapper.find(getDataTestSelector('next-query-icon')).element).toBeDefined();
    expect(wrapper.find(getDataTestSelector('next-query-query')).text()).toEqual(suggestion.query);
  });

  it('highlights NQ if curated and indicated via prop', async () => {
    const { wrapper, suggestion, hasIsCuratedClass } = renderNextQuery();

    expect(hasIsCuratedClass()).toBe(false);

    suggestion.isCurated = true;
    expect(hasIsCuratedClass()).toBe(false);

    await wrapper.setProps({ highlightCurated: true });
    expect(hasIsCuratedClass()).toBe(true);
  });
});

interface RenderNextQueryOptions {
  /** The next query data to render. */
  suggestion?: NextQuery;
  /**
   * The template to render. Receives the `nextQuery` via prop, and has registered the
   * {@link NextQueryComponent} as `NextQuery`.
   */
  template?: string;
}

interface RenderNextQueryAPI {
  /** The Vue testing utils wrapper for the {@link NextQueryComponent}. */
  wrapper: Wrapper<Vue>;
  /** The {@link XComponentAPI} used by the rendered {@link NextQueryComponent}. */
  suggestion: NextQuery;
  /** Clicks the next query and waits for the view to update. */
  clickNextQuery: () => Promise<void>;
  /** Checks if the next query element is being highlighted as curated with CSS class. */
  hasIsCuratedClass: () => boolean;
}
