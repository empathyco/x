import { HistoryQuery } from '@empathyco/x-types-old';
import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import RemoveHistoryQuery from '../remove-history-query.vue';

describe('testing RemoveHistoryQuery component', () => {
  const [, localVue] = installNewXPlugin();
  const historyQuery: HistoryQuery = {
    modelName: 'HistoryQuery',
    query: 'Saltiquinos',
    timestamp: 778394
  };

  it('emits UserPressedRemoveHistoryQuery when it is clicked', () => {
    const listener = jest.fn();

    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });
    removeHistoryQuery.vm.$x.on('UserPressedRemoveHistoryQuery', true).subscribe(listener);

    removeHistoryQuery.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        moduleName: 'historyQueries',
        target: removeHistoryQuery.element
      }
    });
  });

  it('has a default slot with a default message', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });

    expect(removeHistoryQuery.element.textContent).toEqual('');
  });

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-remove-history-query__text">Remove</span>';
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      localVue,
      slots: {
        default: {
          template: slotTemplate
        }
      },
      propsData: {
        historyQuery
      }
    });
    const renderedSlotHTML = removeHistoryQuery.element.querySelector(
      '.x-remove-history-query__text'
    );

    expect(renderedSlotHTML).toBeDefined();
    expect(renderedSlotHTML!.textContent).toEqual('Remove');
  });
});
