import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getNextQueriesStub } from '../../__stubs__';
import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
import { getDataTestSelector } from '../../__tests__/utils';
import { ListItem } from '../../utils';
import BaseGrid from '../base-grid.vue';

function renderBaseGridComponent({
  columns,
  items,
  customItemSlot = `
    <template #banner="{ item }">
      <p data-test="banner-slot">{{ item.modelName }}</p>
    </template>
    <template #result="{ item }">
      <p data-test="result-slot">{{ item.modelName }}</p>
    </template>`,
  template = `
   <BaseGrid :items="items" :columns="columns">
      <template #default="{ item }">
        <p data-test="default-slot">{{ item.modelName }}</p>
      </template>
      ${customItemSlot ?? ''}
   </BaseGrid>`
}: BaseGridRenderOptions = {}): BaseGridComponentAPI {
  const gridWrapper = mount(
    {
      components: {
        BaseGrid
      },
      props: ['items', 'columns'],
      template
    },
    {
      propsData: {
        items,
        columns
      }
    }
  );
  const wrapper = gridWrapper.findComponent(BaseGrid);

  return {
    wrapper,
    getDefaultSlot() {
      return wrapper.findAll(getDataTestSelector('default-slot'));
    },
    getScopedSlot(modelName: string) {
      return wrapper.findAll(getDataTestSelector(`${modelName}-slot`));
    }
  };
}

describe('testing Base Grid', () => {
  const searchResponse = getSearchResponseStub();
  const nextQueriesResponse = [
    {
      modelName: 'NextQueries',
      id: 'nextQueries',
      nextQueries: getNextQueriesStub()
    }
  ];
  const columns = 3;
  const items = [
    ...searchResponse.banners,
    ...searchResponse.promoteds,
    ...searchResponse.results,
    ...nextQueriesResponse
  ];

  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const { wrapper } = renderBaseGridComponent({ items, columns });
    expect(wrapper.classes()).toContain(`x-base-grid--cols-${columns}`);
  });

  it('allows customizing the default slot', () => {
    const template = `
         <BaseGrid :items="items" :columns="columns">
           <template #default="{ item }">
             <p data-test="default-slot-overridden">{{ item.modelName }}</p>
           </template>
         </BaseGrid>`;
    const { wrapper } = renderBaseGridComponent({ items, columns, template });
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });

  it('allows customizing named slots', () => {
    const customItemSlot = `
      <template #banner="{ item }">
        <p data-test="banner-slot">{{ item.modelName }}</p>
      </template>`;
    const { getDefaultSlot, getScopedSlot } = renderBaseGridComponent({
      items,
      columns,
      customItemSlot
    });

    expect(getDefaultSlot().exists()).toBe(true);
    expect(getScopedSlot('result').exists()).toBe(false);
    expect(getScopedSlot('banner').exists()).toBe(true);
  });

  it('allows customizing named slots only using kebab case', () => {
    const customValidItemSlot = `
    <template #banner="{ item }">
      <p data-test="banner-slot">{{ item.modelName }}</p>
    </template>
    <template #NextQueries="{ item }">
      <p data-test="next-queries-slot">{{ item.modelName }}</p>
    </template>
    <template #next-queries="{ item }">
      <p data-test="next-queries-slot">{{ item.modelName }}</p>
    </template>`;
    const { getScopedSlot } = renderBaseGridComponent({
      items,
      columns,
      customItemSlot: customValidItemSlot
    });

    expect(getScopedSlot('banner').exists()).toBe(true);
    expect(getScopedSlot('NextQueries').exists()).toBe(false);
    expect(getScopedSlot('next-queries').exists()).toBe(true);
  });
});

interface BaseGridRenderOptions {
  columns?: number;
  items?: ListItem[];
  customItemSlot?: string;
  template?: string;
}

interface BaseGridComponentAPI {
  wrapper: Wrapper<Vue>;
  getDefaultSlot: () => WrapperArray<Vue>;
  getScopedSlot: (modelName: string) => WrapperArray<Vue>;
}
