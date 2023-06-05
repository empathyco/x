import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { SemanticQuery as SemanticQueryModel } from '@empathyco/x-types';
import SemanticQuery from '../semantic-query.vue';
import { getXComponentXModuleName, isXComponent } from '../../../../components/index';
import { createSemanticQuery } from '../../../../__stubs__/index';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { XPlugin } from '../../../../plugins/index';

describe('semantic queries component', () => {
  function renderSemanticQuery({
    template = '<SemanticQuery :semanticQuery="semanticQuery" v-bind="$attrs"/>',
    semanticQuery = createSemanticQuery({ query: 'jeans' })
  }: RenderSemanticQueryOptions = {}): RenderSemanticQueryAPI {
    const [, localVue] = installNewXPlugin();

    const wrapper = mount(
      {
        template,
        components: { SemanticQuery }
      },
      {
        localVue,
        data() {
          return {
            semanticQuery
          };
        }
      }
    );

    return {
      wrapper: wrapper.findComponent(SemanticQuery),
      emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
      semanticQuery
    };
  }

  it('is an X Component of the Semantic Queries XModule', () => {
    const { wrapper } = renderSemanticQuery();
    expect(isXComponent(wrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(wrapper.vm)).toBe('semanticQueries');
  });

  it('renders the SemanticQuery passed by prop', () => {
    const { wrapper } = renderSemanticQuery({
      semanticQuery: createSemanticQuery({ query: 'test query' })
    });

    expect(wrapper.get(getDataTestSelector('semantic-query')).element).toHaveTextContent(
      'test query'
    );
  });

  it('allows overriding its content with a slot', () => {
    const { wrapper } = renderSemanticQuery({
      template: `
        <SemanticQuery :semanticQuery="semanticQuery" #default="{ query }">
          <span data-test="semantic-query-title">TITLE</span>
          <span data-test="semantic-query-content">{{query.query}}</span>
        </SemanticQuery>
      `,
      semanticQuery: createSemanticQuery({ query: 'test' })
    });

    expect(wrapper.get(getDataTestSelector('semantic-query-title')).element).toHaveTextContent(
      'TITLE'
    );
    expect(wrapper.get(getDataTestSelector('semantic-query-content')).element).toHaveTextContent(
      'test'
    );
  });

  it('emits required events on click', () => {
    const { emitSpy, wrapper, semanticQuery } = renderSemanticQuery();

    wrapper.trigger('click');

    expect(emitSpy).toHaveBeenCalledTimes(3);

    expect(emitSpy).toHaveBeenNthCalledWith(
      1,
      'UserAcceptedAQuery',
      semanticQuery.query,
      expect.anything()
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      2,
      'UserSelectedASuggestion',
      semanticQuery,
      expect.anything()
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      3,
      'UserSelectedASemanticQuery',
      semanticQuery,
      expect.anything()
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
  semanticQuery?: SemanticQueryModel;
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
  semanticQuery: SemanticQueryModel;
}
