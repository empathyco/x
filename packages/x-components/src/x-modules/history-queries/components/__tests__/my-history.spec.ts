import { mount, Wrapper, WrapperArray } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import MyHistory from '../my-history.vue';

function renderMyHistory({ template = '<MyHistory />' }: MyHistoryOptions = {}): MyHistoryAPI {
  const [, localVue] = installNewXPlugin();

  const wrapper = mount(
    {
      template,
      components: {
        MyHistory
      }
    },
    {
      localVue
    }
  );
  return {
    wrapper,
    search(query) {
      wrapper.vm.$x.emit('UserAcceptedAQuery', query);
      return wrapper.vm.$nextTick();
    },
    getListItems() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'));
    }
  };
}

describe('testing MyHistory component', () => {
  it('renders the list of searched queries', async () => {
    const { search, getListItems } = renderMyHistory();

    await search('lego');
    const suggestionsWrappers = getListItems();
    expect(suggestionsWrappers.wrappers).toHaveLength(1);
    expect(suggestionsWrappers.at(0).text()).toEqual('lego');
  });

  it('allows to change the content for each previous search', async () => {
    const { search, getListItems } = renderMyHistory({
      template: `
      <MyHistory #default="{ suggestion, index }">{{ suggestion.query }} - {{ index }}</MyHistory>`
    });

    await search('lego');
    const suggestionWrappers = getListItems();
    expect(suggestionWrappers.wrappers).toHaveLength(1);
    expect(suggestionWrappers.at(0).text()).toEqual('lego - 0');
  });
});

interface MyHistoryOptions {
  template?: string;
}

interface MyHistoryAPI {
  wrapper: Wrapper<Vue>;
  search: (query: string) => Promise<void>;
  getListItems: () => WrapperArray<Vue>;
}
