import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { NextQuery } from '../../../../search-types';
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
  const searchResponse = getSearchResponseStub();
  const defaultItems = [
    ...searchResponse.banners,
    ...searchResponse.promoteds,
    ...searchResponse.results,
    {
      modelName: 'NextQueriesGroup',
      nextQueries: getNextQueriesStub()
    } as NextQueriesGroup
  ];

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
        items: items ?? defaultItems,
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
  const columns = 3;
  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const { wrapper } = renderBaseGridComponent({ columns });
    expect(wrapper.classes()).toContain(`x-base-grid--cols-${columns}`);
  });

  it('allows customizing the default slot', () => {
    const template = `
         <BaseGrid :items="items" :columns="columns">
           <template #default="{ item }">
             <p data-test="default-slot-overridden">{{ item.modelName }}</p>
           </template>
         </BaseGrid>`;
    const { wrapper } = renderBaseGridComponent({ columns, template });
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });

  it('allows customizing named slots', () => {
    const customItemSlot = `
      <template #banner="{ item }">
        <p data-test="banner-slot">{{ item.modelName }}</p>
      </template>`;
    const { getDefaultSlot, getScopedSlot } = renderBaseGridComponent({
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
      <template #NextQueriesGroup="{ item }">
        <p data-test="next-queries-group-slot">{{ item.modelName }}</p>
      </template>
      <template #next-queries-group="{ item }">
        <p data-test="next-queries-group-slot">{{ item.modelName }}</p>
      </template>`;
    const { getScopedSlot } = renderBaseGridComponent({
      columns,
      customItemSlot: customValidItemSlot
    });

    expect(getScopedSlot('banner').exists()).toBe(true);
    expect(getScopedSlot('NextQueriesGroup').exists()).toBe(false);
    expect(getScopedSlot('next-queries-group').exists()).toBe(true);
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

// TODO Remove this interface when the original from the next-queries.list.vue is exported.
interface NextQueriesGroup extends ListItem {
  modelName: 'NextQueriesGroup';
  nextQueries: NextQuery[];
}
