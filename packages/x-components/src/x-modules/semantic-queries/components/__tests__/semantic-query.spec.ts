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
    template = '<SemanticQuery :suggestion="semanticQuery" v-bind="$attrs"/>',
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
      eventsSpy: jest.spyOn(XPlugin.bus, 'emit'),
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
        <SemanticQuery :suggestion="semanticQuery" #default="{ suggestion }">
          <span data-test="semantic-query-title">TITLE</span>
          <span data-test="semantic-query-content">{{suggestion.query}}</span>
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
    const { eventsSpy, wrapper, semanticQuery } = renderSemanticQuery();

    wrapper.trigger('click');

    expect(eventsSpy).toHaveBeenCalledTimes(3);

    expect(eventsSpy).toHaveBeenNthCalledWith(
      1,
      'UserAcceptedAQuery',
      semanticQuery.query,
      expect.anything()
    );
    expect(eventsSpy).toHaveBeenNthCalledWith(
      2,
      'UserSelectedASuggestion',
      semanticQuery,
      expect.anything()
    );
    expect(eventsSpy).toHaveBeenNthCalledWith(
      3,
      'UserSelectedASemanticQuery',
      semanticQuery,
      expect.anything()
    );
  });
});

interface RenderSemanticQueryOptions {
  template?: string;
  semanticQuery?: SemanticQueryModel;
}

interface RenderSemanticQueryAPI {
  wrapper: Wrapper<Vue>;
  eventsSpy: ReturnType<typeof jest.spyOn>;
  semanticQuery: SemanticQueryModel;
}
