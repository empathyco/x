import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { ListItem } from '../../utils/types';
import { getDataTestSelector } from '../../__tests__/utils';
import { getBannersStub } from '../../__stubs__/banners-stubs.factory';
import { getResultsStub } from '../../__stubs__/results-stubs.factory';
import ItemsList from '../items-list.vue';
import { getPromotedsStub } from '../../__stubs__/promoteds-stubs.factory';

/**
 * Renders the `ItemsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the `BannersList` component.
 */
function renderItemsList({
  items = [],
  scopedSlots
}: RenderItemsListOptions = {}): RendersItemsListAPI {
  const wrapper = mount(ItemsList, {
    propsData: {
      items
    },
    scopedSlots
  });

  return {
    wrapper
  };
}

describe('testing ItemsList component', () => {
  const resultsStub = getResultsStub();
  const promotedsStub = getPromotedsStub();
  const bannersStub = getBannersStub();

  it("doesn't render the list if `items` are provided", () => {
    const { wrapper } = renderItemsList({
      items: []
    });

    expect(wrapper.find(getDataTestSelector('items-list')).exists()).toBe(false);
  });

  it('renders the items list passed as property', () => {
    const { wrapper } = renderItemsList({
      items: resultsStub
    });

    const itemsWrapperArray = wrapper.findAll('.x-items-list__item');
    expect(itemsWrapperArray).toHaveLength(resultsStub.length);
    resultsStub.forEach((result, index: number) => {
      expect(itemsWrapperArray.at(index).text()).toBe(result.id);
    });
  });

  it('renders item attributes depending on the item `modelName`', () => {
    const { wrapper } = renderItemsList({
      items: [resultsStub[0], promotedsStub[0], bannersStub[0]]
    });

    const resultItemWrapper = wrapper.find(getDataTestSelector('results-list-item'));
    expect(resultItemWrapper.exists()).toBe(true);
    expect(resultItemWrapper.classes()).toEqual(['x-items-list__item', 'x-results-list-item']);

    const bannerItemWrapper = wrapper.find(getDataTestSelector('banners-list-item'));
    expect(bannerItemWrapper.exists()).toBe(true);
    expect(bannerItemWrapper.classes()).toEqual(['x-items-list__item', 'x-banners-list-item']);

    const promotedItemWrapper = wrapper.find(getDataTestSelector('promoteds-list-item'));
    expect(promotedItemWrapper.exists()).toBe(true);
    expect(promotedItemWrapper.classes()).toEqual(['x-items-list__item', 'x-promoteds-list-item']);
  });

  it('allows to customize each item using the slot', () => {
    const { wrapper } = renderItemsList({
      scopedSlots: {
        result: `<template #result="{ item }">Result: {{ item.name }}</template>`,
        banner: `<template #banner="{ item }">Banner: {{ item.title }}</template>`,
        promoted: `<template #promoted="{ item }">Promoted: {{ item.title }}</template>`
      },
      items: [resultsStub[0], promotedsStub[0], bannersStub[0]]
    });

    expect(wrapper.find(getDataTestSelector('results-list-item')).text()).toBe(
      `Result: ${resultsStub[0].name!}`
    );

    expect(wrapper.find(getDataTestSelector('banners-list-item')).text()).toBe(
      `Banner: ${bannersStub[0].title}`
    );

    expect(wrapper.find(getDataTestSelector('promoteds-list-item')).text()).toBe(
      `Promoted: ${promotedsStub[0].title}`
    );
  });
});

interface RenderItemsListOptions {
  /** Items to be passed to the component. */
  items?: ListItem[];
  /** Scoped slots to be passed to the mount function. */
  scopedSlots?: Record<string, string>;
}

interface RendersItemsListAPI {
  /** The `wrapper` wrapper component. */
  wrapper: Wrapper<Vue>;
}
