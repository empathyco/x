import { mount } from '@vue/test-utils';
import { getDataTestSelector } from '../../__tests__/utils';
import BaseRating from '../base-rating.vue';

describe('testing Rating component', () => {
  it('renders a number of elements based on the max prop', () => {
    const max = 10;
    const overriddenSlotComponent = mount(BaseRating, {
      propsData: {
        value: 3.2,
        max
      }
    });
    expect(overriddenSlotComponent.findAll('.x-rating__default-icon--filled')).toHaveLength(max);
    expect(overriddenSlotComponent.findAll('.x-rating__default-icon--empty')).toHaveLength(max);
  });

  it('renders the content overriding filledIcon slot', () => {
    const overriddenSlotComponent = mount(BaseRating, {
      propsData: {
        value: 3.2
      },
      scopedSlots: {
        ['filledIcon']: '<span data-test="filled-icon" />'
      }
    });

    expect(overriddenSlotComponent.find(getDataTestSelector('filled-icon')).element).toBeDefined();
  });

  it('renders the content overriding emptyIcon slot', () => {
    const overriddenSlotComponent = mount(BaseRating, {
      propsData: {
        value: 3.2
      },
      scopedSlots: {
        ['emptyIcon']: '<span data-test="empty-icon" />'
      }
    });

    expect(overriddenSlotComponent.find(getDataTestSelector('empty-icon')).element).toBeDefined();
  });
});
