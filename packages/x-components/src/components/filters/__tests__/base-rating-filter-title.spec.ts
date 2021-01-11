import { SimpleFilter } from '@empathy/search-types';
import { mount, Wrapper } from '@vue/test-utils';
import { getSimpleFilterStub } from '../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseRatingFilterTitle from '../base-rating-filter-title.vue';

function renderBaseRatingTitle({
  template = '<BaseRatingFilterTitle :filter="filter"/>',
  filter = getSimpleFilterStub({ label: '3' })
}: RenderBaseRatingTitleOptions = {}): Wrapper<BaseRatingFilterTitle> {
  return mount(
    {
      components: { BaseRatingFilterTitle },
      props: ['filter'],
      template
    },
    {
      propsData: {
        filter
      }
    }
  );
}

describe('testing Base Rating Filter Title component', () => {
  it('renders a rating component', () => {
    const wrapper = renderBaseRatingTitle();

    expect(wrapper.find(getDataTestSelector('rating-title')).exists()).toBe(true);
  });

  it('renders the filled icon element according the value passed and the max', () => {
    const value = '2.2';
    const max = 5;
    const filter = getSimpleFilterStub({ label: value });
    const widthFilledWrapper = `${(parseFloat(value) * 100) / max}%`;
    const wrapper = renderBaseRatingTitle({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual(
      widthFilledWrapper
    );
  });

  it('renders the default value 0 if the filter label is a negative number', () => {
    const filter = getSimpleFilterStub({ label: '-2' });
    const wrapper = renderBaseRatingTitle({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual('0%');
  });

  it('renders the default value 0 if the filter label is a not valid number string', () => {
    const filter = getSimpleFilterStub({ label: 'abc' });
    const wrapper = renderBaseRatingTitle({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual('0%');
  });

  it('renders the content overriding rating-icon-filled slot', () => {
    const wrapper = renderBaseRatingTitle({
      template: `<BaseRatingFilterTitle :filter="filter">
                  <template #rating-icon-filled>'<span data-test="filled-icon" /></template>
                 </BaseRatingFilterTitle>`
    });

    expect(wrapper.find(getDataTestSelector('filled-icon')).exists()).toBe(true);
  });

  it('renders the content overriding rating-icon-empty slot', () => {
    const wrapper = renderBaseRatingTitle({
      template: `<BaseRatingFilterTitle :filter="filter">
                  <template #rating-icon-empty>'<span data-test="empty-icon" /></template>
                 </BaseRatingFilterTitle>`
    });

    expect(wrapper.find(getDataTestSelector('empty-icon')).exists()).toBe(true);
  });
});

/**
 * Options to configure how the base rating component should be rendered.
 */
interface RenderBaseRatingTitleOptions {
  template?: string;
  filter?: SimpleFilter;
}
