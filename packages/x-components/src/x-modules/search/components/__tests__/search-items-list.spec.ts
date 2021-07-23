import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { SearchItem } from '../../../../utils/types';
import { getDataTestSelector } from '../../../../__tests__/utils';
import { getBannersStub } from '../../../../__stubs__/banners-stubs.factory';
import { getResultsStub } from '../../../../__stubs__/results-stubs.factory';
import { SearchItemsList } from '../index';
import { getPromotedsStub } from '../../../../__stubs__/promoteds-stubs.factory';

/**
 * Renders the `SearchItemsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `BannersList` component.
 */
function renderSearchItemsList({
  searchItems = [],
  scopedSlots
}: RenderSearchItemsListOptions = {}): RendersSearchItemsListAPI {
  const wrapper = mount(SearchItemsList, {
    propsData: {
      searchItems
    },
    scopedSlots
  });

  return {
    wrapper
  };
}

describe('testing SearchItemsList component', () => {
  const resultsStub = getResultsStub();
  const promotedsStub = getPromotedsStub();
  const bannersStub = getBannersStub();

  it("doesn't render the list if `searchItems` are provided", () => {
    const { wrapper } = renderSearchItemsList({
      searchItems: []
    });

    expect(wrapper.find(getDataTestSelector('search-items-list')).exists()).toBe(false);
  });

  it('renders the items list passed as property', () => {
    const { wrapper } = renderSearchItemsList({
      searchItems: resultsStub
    });

    const itemsWrapperArray = wrapper.findAll('.x-search-items-list__item');
    expect(itemsWrapperArray).toHaveLength(resultsStub.length);
    resultsStub.forEach((result, index: number) => {
      expect(itemsWrapperArray.at(index).text()).toBe(result.id);
    });
  });

  it('renders item attributes depending on the item `modelName`', () => {
    const { wrapper } = renderSearchItemsList({
      searchItems: [resultsStub[0], promotedsStub[0], bannersStub[0]]
    });

    const resultItemWrapper = wrapper.find(getDataTestSelector('results-list-item'));
    expect(resultItemWrapper.exists()).toBe(true);
    expect(resultItemWrapper.classes()).toEqual([
      'x-search-items-list__item',
      'x-results-list-item'
    ]);

    const bannerItemWrapper = wrapper.find(getDataTestSelector('banners-list-item'));
    expect(bannerItemWrapper.exists()).toBe(true);
    expect(bannerItemWrapper.classes()).toEqual([
      'x-search-items-list__item',
      'x-banners-list-item'
    ]);

    const promotedItemWrapper = wrapper.find(getDataTestSelector('promoteds-list-item'));
    expect(promotedItemWrapper.exists()).toBe(true);
    expect(promotedItemWrapper.classes()).toEqual([
      'x-search-items-list__item',
      'x-promoteds-list-item'
    ]);
  });

  it('allows to customize each item using the slot', () => {
    const { wrapper } = renderSearchItemsList({
      scopedSlots: {
        result: `<template #result="{ searchItem }">Result: {{ searchItem.name }}</template>`,
        banner: `<template #banner="{ searchItem }">Banner: {{ searchItem.title }}</template>`,
        promoted: `<template #promoted="{ searchItem }">Promoted: {{ searchItem.title }}</template>`
      },
      searchItems: [resultsStub[0], promotedsStub[0], bannersStub[0]]
    });

    expect(wrapper.find(getDataTestSelector('results-list-item')).text()).toBe(
      `Result: ${resultsStub[0].name}`
    );

    expect(wrapper.find(getDataTestSelector('banners-list-item')).text()).toBe(
      `Banner: ${bannersStub[0].title}`
    );

    expect(wrapper.find(getDataTestSelector('promoteds-list-item')).text()).toBe(
      `Promoted: ${promotedsStub[0].title}`
    );
  });
});

interface RenderSearchItemsListOptions {
  /** Items to be passed to the component. */
  searchItems?: SearchItem[];
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: any;
}

interface RendersSearchItemsListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
}
