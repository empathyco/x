import { BooleanFilter, Suggestion } from '@empathyco/x-types';
import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XPlugin } from '../../../plugins/index';
import { normalizeString } from '../../../utils/index';
import { WireMetadata, XEventsTypes } from '../../../wiring/index';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseSuggestion from '../base-suggestion.vue';

describe('testing Base Suggestion component', () => {
  const [, localVue] = installNewXPlugin();

  const query = normalizeString('(b<ebé>)');
  const suggestion: Suggestion = {
    query: '(b<ebé>) lloron',
    facets: [
      {
        id: 'rootCategories',
        label: 'rootCategories',
        modelName: 'SimpleFacet',
        filters: <Array<BooleanFilter>>[
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"DORMIR"',
            label: 'DORMIR',
            selected: false,
            totalResults: 60,
            modelName: 'SimpleFilter'
          },
          {
            facetId: 'rootCategories',
            id: '{!tag=rootFilter}rootCategories_60361120_64009600:"SPECIAL PRICES"',
            label: 'SPECIAL PRICES',
            selected: false,
            totalResults: 24,
            modelName: 'SimpleFilter'
          }
        ]
      }
    ],
    key: 'bebe lloron',
    modelName: 'QuerySuggestion'
  };

  const suggestionSelectedEvents: Partial<XEventsTypes> = {
    UserSelectedAQuerySuggestion: suggestion,
    UserTalked: 'belt'
  };

  const getWireMetadataObject = (component: Wrapper<Vue>): Partial<WireMetadata> =>
    expect.objectContaining<Partial<WireMetadata>>({ target: component.element });

  let component: Wrapper<Vue>;

  beforeEach(() => {
    component = mount(BaseSuggestion, {
      localVue,
      propsData: { query, suggestion, suggestionSelectedEvents, showFacets: true }
    });
  });

  it('passes the prop suggestion to the default slot', () => {
    expect(component.element.textContent).toContain(suggestion.query);
  });

  it('passes the prop suggestionFilter to the default slot', () => {
    expect(component.element.textContent).toContain(
      (<BooleanFilter>suggestion.facets[0].filters[0]).label
    );
  });

  it('has suggestion query parts matching query passed as prop retaining accent marks', () => {
    const matchingPart = component.find(getDataTestSelector('matching-part')).text();

    expect(normalizeString(matchingPart)).toEqual(query);
    expect(suggestion.query).toContain(matchingPart);
  });

  it('sanitizes the matching part of the suggestion query', () => {
    const matchingPartHTML = component.find(getDataTestSelector('matching-part')).element.innerHTML;

    expect(matchingPartHTML).toBe('(b&lt;ebé&gt;)');
  });

  it('does not have matched query if the query prop is empty', () => {
    component.setProps({ query: '' });
    const hasMatchingQuery = (component.vm as any).hasMatchingQuery;

    expect(hasMatchingQuery).toBe(false);
  });

  it('does not have a filter label if the suggestion has no facets', async () => {
    await component.setProps({ suggestion: { ...suggestion, facets: [] } });
    expect(component.element.textContent).not.toContain(
      (<BooleanFilter>suggestion.facets[0].filters[0]).label
    );
  });

  it('emits suggestionSelectedEvent and the default events onclick', async () => {
    const target = getWireMetadataObject(component);
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');

    await localVue.nextTick();

    expect(spyOn).toHaveBeenNthCalledWith(1, 'UserAcceptedAQuery', suggestion.query, target);
    expect(spyOn).toHaveBeenNthCalledWith(2, 'UserSelectedASuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(3, 'UserSelectedAQuerySuggestion', suggestion, target);
    expect(spyOn).toHaveBeenNthCalledWith(4, 'UserTalked', 'belt', target);
  });

  it('emits UserClickedAFilter if the suggestions has a filter', async () => {
    await component.setProps({ showFacets: true });
    const target = getWireMetadataObject(component);
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');
    await localVue.nextTick();
    expect(spyOn).toHaveBeenCalledWith(
      'UserClickedAFilter',
      suggestion.facets[0].filters[0],
      target
    );
  });

  it("won't emit UserClickedAFilter if showFacets is false", async () => {
    await component.setProps({ showFacets: false });
    const spyOn = jest.spyOn(XPlugin.bus, 'emit');
    component.trigger('click');
    await localVue.nextTick();
    expect(spyOn).not.toHaveBeenCalledWith('UserClickedAFilter');
  });
});
