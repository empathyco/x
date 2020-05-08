import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { getSuggestionsStub } from '../../../../__stubs__/suggestions-stubs.factory';
import { SearchAdapterDummy } from '../../../../__tests__/adapter.dummy';
import { getDataTestSelector } from '../../../../__tests__/utils';
import NoSuggestions from '../no-suggestions.vue';
import { resetStoreNoSuggestionsState } from './utils';

describe('testing no suggestions component', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store: Store<DeepPartial<RootXStoreState>> = new Store({});
  localVue.use(XPlugin, { store, adapter: SearchAdapterDummy });

  let noSuggestionsWrapper: Wrapper<Vue>;
  const query = 'Mitsubishi evo IX';
  const suggestions = getSuggestionsStub('QuerySuggestion');

  beforeEach(() => {
    noSuggestionsWrapper = mount(NoSuggestions, { localVue, store });
    resetStoreNoSuggestionsState(store);
  });

  it('is an XComponent', () => {
    expect(isXComponent(noSuggestionsWrapper.vm)).toEqual(true);
    expect(getXComponentXModuleName(noSuggestionsWrapper.vm)).toBe('noSuggestions');
  });

  it("doesn't render the component without query", () => {
    expect(getNoSuggestionsWrapperElement().exists()).toBeFalsy();
  });

  it("doesn't render the component when fetching data", async () => {
    resetStoreNoSuggestionsState(store, { query });
    await localVue.nextTick(); // Execute query watcher

    expect(getNoSuggestionsWrapperElement().exists()).toBeFalsy();
  });

  it("doesn't render the component when there are suggestions", async () => {
    resetStoreNoSuggestionsState(store, { query });
    await localVue.nextTick(); // Execute query watcher
    noSuggestionsWrapper.vm.$x.emit('QuerySuggestionsChanged', suggestions);
    await localVue.nextTick(); // Execute hasSuggestionsOrLoading computed property

    expect(getNoSuggestionsWrapperElement().exists()).toBeFalsy();
  });

  it('renders the component when there is query and no suggestions', async () => {
    resetStoreNoSuggestionsState(store, { query });
    await localVue.nextTick(); // Execute query watcher
    noSuggestionsWrapper.vm.$x.emit('QuerySuggestionsChanged', []);
    await localVue.nextTick(); // Execute hasSuggestionsOrLoading computed property

    expect(getNoSuggestionsWrapperElement().exists()).toBeTruthy();
  });

  describe('testing rendered component', () => {
    let wrapperElement: Wrapper<Vue>;

    beforeEach(async () => {
      resetStoreNoSuggestionsState(store, { query });
      await localVue.nextTick(); // Execute query watcher
      noSuggestionsWrapper.vm.$x.emit('QuerySuggestionsChanged', []);
      await localVue.nextTick(); // Execute hasSuggestionsOrLoading computed property
      wrapperElement = getNoSuggestionsWrapperElement();
    });

    it('has the noSuggestions.content message', () => {
      const textElement = wrapperElement.vm.$x.config.messages.noSuggestions.content.replace(
        /{(.+)}/g,
        query
      );

      expect(trimSpacesAndBreakLines(wrapperElement.text())).toEqual(textElement);
    });

    it('renders a button with the user query', () => {
      const buttonWrapperElement = wrapperElement.find('button');
      const listener = jest.fn();
      noSuggestionsWrapper.vm.$x.on('UserAcceptedAQuery').subscribe(listener);

      expect(buttonWrapperElement.exists()).toBeTruthy();
      buttonWrapperElement.trigger('click');
      expect(listener).toHaveBeenCalled();
    });

    it("doesn't render a button when the message has not slot for that", async () => {
      const message = 'No suggestions available!';
      wrapperElement.vm.$x.config.messages.noSuggestions.content = message;

      await localVue.nextTick(); // Execute dividedMessage getter

      expect(wrapperElement.find('button').exists()).toBeFalsy();
      expect(wrapperElement.text()).toEqual(message);
    });
  });

  describe('testing `eventsToRender` config after changing it by prop', () => {
    beforeEach(async () => {
      resetStoreNoSuggestionsState(store, { query });
      await localVue.nextTick(); // Execute query watcher
      noSuggestionsWrapper.setProps({
        eventsToRender: ['NextQueriesChanged', 'QuerySuggestionsChanged']
      });
      await localVue.nextTick(); // Execute eventsToRender watcher
    });

    it("doesn't render the component because `suggestionsEvents` object is restarted", () => {
      expect(getNoSuggestionsWrapperElement().exists()).toBeFalsy();
    });

    it("doesn't render the component when one of the events has suggestions", async () => {
      noSuggestionsWrapper.vm.$x.emit('NextQueriesChanged', []);
      noSuggestionsWrapper.vm.$x.emit('QuerySuggestionsChanged', suggestions);
      await localVue.nextTick(); // Execute hasSuggestionsOrLoading computed property

      expect(getNoSuggestionsWrapperElement().exists()).toBeFalsy();
    });

    it('renders the component when every event has not suggestions', async () => {
      noSuggestionsWrapper.vm.$x.emit('NextQueriesChanged', []);
      noSuggestionsWrapper.vm.$x.emit('QuerySuggestionsChanged', []);
      await localVue.nextTick(); // Execute hasSuggestionsOrLoading computed property

      expect(getNoSuggestionsWrapperElement().exists()).toBeTruthy();
    });
  });

  function getNoSuggestionsWrapperElement(): Wrapper<Vue> {
    return noSuggestionsWrapper.find(getDataTestSelector('no-suggestions'));
  }

  function trimSpacesAndBreakLines(text: string): string {
    return text.replace(/\r?\n|\r|\t|\s{2,}/g, '');
  }
});
