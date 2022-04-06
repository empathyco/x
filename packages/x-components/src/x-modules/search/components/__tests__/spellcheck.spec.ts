import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store';
import Spellcheck from '../spellcheck.vue';
import { resetXSearchStateWith } from './utils';

function renderSpellcheck({
  template = `<Spellcheck/>`,
  spellcheckedQuery
}: RenderSpellcheckOptions = {}): RenderSpellcheckAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  resetXSearchStateWith(store, {
    query: 'coce',
    spellcheckedQuery
  });

  const wrapper = mount(
    {
      components: {
        Spellcheck
      },
      template
    },
    {
      localVue,
      store
    }
  );

  return {
    wrapper
  };
}

describe('testing Spellcheck component', () => {
  it('does not render any content when there is not spellcheckedQuery', () => {
    const { wrapper } = renderSpellcheck();
    expect(wrapper.find(getDataTestSelector('spellcheck')).element).not.toBeDefined();
  });

  it('renders the default spellcheck message', () => {
    const { wrapper } = renderSpellcheck({ spellcheckedQuery: 'coche' });

    expect(wrapper.find(getDataTestSelector('spellcheck')).text()).toBe('coce - coche');
  });

  it('renders a custom spellcheck message', () => {
    const { wrapper } = renderSpellcheck({
      template: `
      <Spellcheck>
        <template #default="{ query, spellcheckedQuery }">
          No results found for '{{ query }}'. We show you results for '{{ spellcheckedQuery }}'
        </template>
      </Spellcheck>
      `,
      spellcheckedQuery: 'coche'
    });
    expect(wrapper.find(getDataTestSelector('spellcheck')).text()).toBe(
      "No results found for 'coce'. We show you results for 'coche'"
    );
  });
});

interface RenderSpellcheckOptions {
  /** The template to be rendered. */
  template?: string;
  /** The spellcheckedQuery for the state. */
  spellcheckedQuery?: string;
}

interface RenderSpellcheckAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
}
