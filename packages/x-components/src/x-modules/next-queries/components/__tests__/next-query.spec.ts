import { mount } from '@vue/test-utils';
import { createNextQueryStub } from '../../../../__stubs__/next-queries-stubs.factory';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import NextQuery from '../next-query.vue';

describe('testing next query item component', () => {
  const suggestion = createNextQueryStub('milk');
  const [, localVue] = installNewXPlugin();

  const nextQueryWrapper = mount(NextQuery, { localVue, propsData: { suggestion } });

  it('is an XComponent and has an XModule', () => {
    expect(isXComponent(nextQueryWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(nextQueryWrapper.vm)).toBe('nextQueries');
  });

  it('emits UserSelectedANextQuery when a next query is selected', () => {
    const listener = jest.fn();
    nextQueryWrapper.vm.$x.on('UserSelectedANextQuery').subscribe(listener);
    nextQueryWrapper.trigger('click');

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(suggestion);
  });

  it('renders a button with the query of the next query (suggestion)', () => {
    const nextQuerySuggestion = nextQueryWrapper.find(getDataTestSelector('next-query'));
    expect(nextQuerySuggestion.text()).toEqual(suggestion.query);
  });

  it('renders a button overriding the default content', () => {
    const wrapperComponent = {
      template: `
        <NextQuery :suggestion="suggestion">
          <template #default="{ suggestion }">
            <img  data-test="next-query-icon" src="./next-query.svg"/>
            <span data-test="next-query-query" :aria-label="suggestion.query">
              {{ suggestion.query }}
            </span>
          </template>
        </NextQuery>
      `,
      props: ['suggestion'],
      components: {
        NextQuery
      }
    };

    const nextQueryCustomWrapper = mount(wrapperComponent, {
      localVue,
      propsData: { suggestion }
    });
    expect(nextQueryCustomWrapper.find(getDataTestSelector('next-query')).element).toBeDefined();
    expect(
      nextQueryCustomWrapper.find(getDataTestSelector('next-query-icon')).element
    ).toBeDefined();
    expect(nextQueryCustomWrapper.find(getDataTestSelector('next-query-query')).text()).toEqual(
      suggestion.query
    );
  });
});
