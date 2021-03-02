import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import Vue from 'vue';
import { getSearchResponseStub } from '../../__stubs__/search-response-stubs.factory';
import { getDataTestSelector } from '../../__tests__/utils';
import { Identifiable } from '../../utils/types';
import BaseGrid from '../base-grid.vue';

function renderBaseGridComponent({
  columns,
  items,
  customItemSlot = `
    <template #Banner="{ item }">
      <p data-test="banner-slot">{{ item.modelName }}</p>
    </template>
    <template #Result="{ item }">
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
  const columns = 3;
  const items = [...searchResponse.banners, ...searchResponse.promoteds, ...searchResponse.results];

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
      <template #Banner="{ item }">
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
});

interface BaseGridRenderOptions {
  columns?: number;
  items?: Identifiable[];
  customItemSlot?: string;
  template?: string;
}

interface BaseGridComponentAPI {
  wrapper: Wrapper<Vue>;
  getDefaultSlot: () => WrapperArray<Vue>;
  getScopedSlot: (modelName: string) => WrapperArray<Vue>;
}
