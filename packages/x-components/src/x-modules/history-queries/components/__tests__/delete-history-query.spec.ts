import { HistoryQuery } from '@empathy/search-types';
import { createLocalVue, mount } from '@vue/test-utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import DeleteHistoryQuery from '../delete-history-query.vue';

describe('testing DeleteHistoryQuery component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });
  const historyQuery: HistoryQuery = {
    modelName: 'HistoryQuery',
    query: 'Saltiquinos',
    timestamp: 778394
  };

  it('emits UserPressedDeleteHistoryQuery when it is clicked', () => {
    const listener = jest.fn();

    const deleteHistoryQuery = mount(DeleteHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });
    deleteHistoryQuery.vm.$x.on('UserPressedRemoveHistoryQuery', true).subscribe(listener);

    deleteHistoryQuery.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery.query,
      metadata: {
        moduleName: 'historyQueries',
        target: deleteHistoryQuery.element
      }
    });
  });

  it('has a default slot with a default message', () => {
    const deleteHistoryQuery = mount(DeleteHistoryQuery, {
      localVue,
      propsData: {
        historyQuery
      }
    });

    expect(deleteHistoryQuery.element.textContent).toEqual(
      deleteHistoryQuery.vm.$x.config.messages.historyQueries.deleteHistoryQuery.content
    );
  });

  it('has a default slot to customize its contents', () => {
    const slotTemplate = '<span class="x-delete-history-query__text">Delete</span>';
    const deleteHistoryQuery = mount(DeleteHistoryQuery, {
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
    const renderedSlotHTML = deleteHistoryQuery.element.querySelector(
      '.x-delete-history-query__text'
    );

    expect(renderedSlotHTML).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderedSlotHTML!.textContent).toEqual('Delete');
  });
});
