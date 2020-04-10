import { HistoryQuery as HistoryQueryModel } from '@empathy/search-types';
import { createLocalVue, mount } from '@vue/test-utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { SearchAdapterDummy } from '../../../../plugins/__tests__/adapter.dummy';
import { XPlugin } from '../../../../plugins/x-plugin';
import HistoryQuery from '../history-query.vue';
import { getDataTestSelector } from '../../../../__tests__/utils';

describe('testing history-query component', () => {
  const localVue = createLocalVue();
  localVue.use(XPlugin, { adapter: SearchAdapterDummy });

  const historyQuery: HistoryQueryModel = {
    modelName: 'HistoryQuery',
    timestamp: 1000,
    query: 'Pan de bola'
  };
  const historyQueryWrapper = mount(HistoryQuery, {
    localVue,
    propsData: {
      suggestion: historyQuery
    }
  });

  it('is an XComponent', () => {
    expect(isXComponent(historyQueryWrapper.vm)).toEqual(true);
  });

  it('has QuerySuggestionModule as XModule', () => {
    expect(getXComponentXModuleName(historyQueryWrapper.vm)).toEqual('historyQueries');
  });

  it('emits the history query selected event when it is clicked', () => {
    const listener = jest.fn();
    historyQueryWrapper.vm.$x.on('UserSelectedAHistoryQuery', true).subscribe(listener);
    const suggestionButton = historyQueryWrapper.find(
      getDataTestSelector('history-query-suggestion')
    );
    suggestionButton.trigger('click');

    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        target: suggestionButton.element,
        moduleName: 'historyQueries'
      }
    });
  });

  it('button ClearHistoryQuery emits UserPressedDeleteHistoryQuery when it is clicked', () => {
    const listener = jest.fn();
    const deleteHistoryQueryWrapper = historyQueryWrapper.find(
      getDataTestSelector('delete-history-query')
    );
    deleteHistoryQueryWrapper.vm.$x.on('UserPressedDeleteHistoryQuery', true).subscribe(listener);
    deleteHistoryQueryWrapper.trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({
      eventPayload: historyQuery,
      metadata: {
        moduleName: 'historyQueries',
        target: deleteHistoryQueryWrapper.element
      }
    });
  });

  it('renders slots with default implementation', () => {
    const historyQuerySuggestion = historyQueryWrapper.find(
      getDataTestSelector('history-query-suggestion')
    );
    const deleteHistoryQueryWrapper = historyQueryWrapper.find(
      getDataTestSelector('delete-history-query')
    );

    expect(historyQuerySuggestion.text()).not.toHaveLength(0);
    expect(deleteHistoryQueryWrapper.text()).not.toHaveLength(0);
  });

  it('has a default slot to customize suggestion content', () => {
    const historyQueryWrapper = mount(HistoryQuery, {
      localVue,
      propsData: {
        suggestion: historyQuery
      },
      scopedSlots: {
        default: '<span class="custom-suggestion-content">{{props.suggestion.query}}</span>'
      }
    });

    const customContent = historyQueryWrapper.find('.custom-suggestion-content');
    expect(customContent.element).toBeDefined();
    expect(customContent.text()).toEqual(historyQuery.query);
  });

  it('has a "delete-button-content" to customize the delete button content', () => {
    const historyQueryWrapper = mount(HistoryQuery, {
      localVue,
      propsData: {
        suggestion: historyQuery
      },
      scopedSlots: {
        'delete-button-content':
          '<span class="custom-delete-button-content">Delete {{props.suggestion.query}}</span>'
      }
    });

    const customContent = historyQueryWrapper.find('.custom-delete-button-content');
    expect(customContent.element).toBeDefined();
    expect(customContent.text()).toEqual(`Delete ${historyQuery.query}`);
  });
});
