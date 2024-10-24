import { HistoryQuery } from '@empathyco/x-types';
import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../../../__tests__/utils';
import RemoveHistoryQuery from '../remove-history-query.vue';
import { XPlugin } from '../../../../plugins/index';

describe('testing RemoveHistoryQuery component', () => {
  const historyQuery: HistoryQuery = {
    modelName: 'HistoryQuery',
    query: 'Saltiquinos',
    timestamp: 778394
  };

  it('emits UserPressedRemoveHistoryQuery when it is clicked', () => {
    const listener = jest.fn();

    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery
      },
      global: {
        plugins: [installNewXPlugin()]
      }
    });
    XPlugin.bus.on('UserPressedRemoveHistoryQuery', true).subscribe(listener);

    removeHistoryQuery.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        moduleName: 'historyQueries',
        target: removeHistoryQuery.element,
        location: 'none',
        replaceable: true
      }
    });
  });

  it('has a default slot with a default message', () => {
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      props: {
        historyQuery
      },
      global: {
        plugins: [installNewXPlugin()]
      }
    });

    expect(removeHistoryQuery.element.textContent).toEqual('');
  });

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-remove-history-query__text">Remove</span>';
    const removeHistoryQuery = mount(RemoveHistoryQuery, {
      slots: {
        default: {
          template: slotTemplate
        }
      },
      props: {
        historyQuery
      },
      global: {
        plugins: [installNewXPlugin()]
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const renderedSlotHTML = removeHistoryQuery.element.querySelector(
      '.x-remove-history-query__text'
    );

    expect(renderedSlotHTML).toBeDefined();
    expect(renderedSlotHTML.textContent).toEqual('Remove');
  });
});
