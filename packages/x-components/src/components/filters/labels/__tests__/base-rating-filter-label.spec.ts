import { SimpleFilter } from '@empathyco/x-types-old';
import { mount, Wrapper } from '@vue/test-utils';
import { getSimpleFilterStub } from '../../../../__stubs__/filters-stubs.factory';
import { getDataTestSelector } from '../../../../__tests__/utils';
import BaseRatingFilterLabel from '../base-rating-filter-label.vue';

function renderBaseRatingLabel({
  template = '<BaseRatingFilterLabel :filter="filter"/>',
  filter = getSimpleFilterStub({ label: '3' })
}: RenderBaseRatingLabelOptions = {}): Wrapper<BaseRatingFilterLabel> {
  return mount(
    {
      components: { BaseRatingFilterLabel },
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

describe('testing Base Rating Filter Label component', () => {
  it('renders a rating component', () => {
    const wrapper = renderBaseRatingLabel();

    expect(wrapper.find(getDataTestSelector('rating-label')).exists()).toBe(true);
  });

  it('renders the filled icon element according the value passed and the max', () => {
    const value = '2.2';
    const max = 5;
    const filter = getSimpleFilterStub({ label: value });
    const widthFilledWrapper = `${(parseFloat(value) * 100) / max}%`;
    const wrapper = renderBaseRatingLabel({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual(
      widthFilledWrapper
    );
  });

  it('renders the default value 0 if the filter label is a negative number', () => {
    const filter = getSimpleFilterStub({ label: '-2' });
    const wrapper = renderBaseRatingLabel({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual('0%');
  });

  it('renders the default value 0 if the filter label is a not valid number string', () => {
    const filter = getSimpleFilterStub({ label: 'abc' });
    const wrapper = renderBaseRatingLabel({ filter });

    expect(wrapper.find(getDataTestSelector('rating-filled')).element.style.width).toEqual('0%');
  });

  it('renders the content overriding rating-icon-filled slot', () => {
    const wrapper = renderBaseRatingLabel({
      template: `<BaseRatingFilterLabel :filter="filter">
                  <template #rating-icon-filled>'<span data-test="filled-icon" /></template>
                 </BaseRatingFilterLabel>`
    });

    expect(wrapper.find(getDataTestSelector('filled-icon')).exists()).toBe(true);
  });

  it('renders the content overriding rating-icon-empty slot', () => {
    const wrapper = renderBaseRatingLabel({
      template: `<BaseRatingFilterLabel :filter="filter">
                  <template #rating-icon-empty>'<span data-test="empty-icon" /></template>
                 </BaseRatingFilterLabel>`
    });

    expect(wrapper.find(getDataTestSelector('empty-icon')).exists()).toBe(true);
  });
});

/**
 * Options to configure how the base rating component should be rendered.
 */
interface RenderBaseRatingLabelOptions {
  template?: string;
  filter?: SimpleFilter;
}
