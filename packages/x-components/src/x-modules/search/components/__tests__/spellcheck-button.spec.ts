import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils';
import { BaseEventButton } from '../../../../components';
import { RootXStoreState } from '../../../../store';
import { DeepPartial } from '../../../../utils';
import SpellcheckButton from '../spellcheck-button.vue';
import { resetXSearchStateWith } from './utils';

function renderSpellcheckButton({
  template = `<SpellcheckButton />`,
  spellcheckedQuery
}: RenderSpellcheckButtonOptions = {}): RenderSpellcheckButtonAPI {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  resetXSearchStateWith(store, { query: 'coce', spellcheckedQuery });

  const wrapper = mount(
    {
      components: {
        SpellcheckButton
      },
      template
    },
    {
      localVue,
      store
    }
  );

  return {
    wrapper,
    async clickEventButton() {
      const eventButton = wrapper.findComponent(BaseEventButton);
      eventButton.trigger('click');
      await localVue.nextTick();
    }
  };
}

describe('testing SpellcheckButton component', () => {
  it('does not render any content when there is not spellcheckedQuery', () => {
    const { wrapper } = renderSpellcheckButton();
    expect(wrapper.find(getDataTestSelector('set-spellcheck')).element).not.toBeDefined();
  });

  it('renders the default spellcheck message', () => {
    const { wrapper } = renderSpellcheckButton({ spellcheckedQuery: 'coche' });

    expect(wrapper.find(getDataTestSelector('set-spellcheck')).text()).toBe('coche');
  });

  it('renders a custom spellcheck message', () => {
    const { wrapper } = renderSpellcheckButton({
      template: `
    <SpellcheckButton>
      <template #default="{ spellcheckedQuery }">
        <span data-test="set-spellcheck__text" class="x-spellcheck__text">
          Set the Spellcheck as the new query: {{ spellcheckedQuery}}!
        </span>
      </template>
    </SpellcheckButton>
      `,
      spellcheckedQuery: 'coche'
    });
    expect(wrapper.find(getDataTestSelector('set-spellcheck__text')).text()).toBe(
      'Set the Spellcheck as the new query: coche!'
    );
  });

  // eslint-disable-next-line max-len
  it('emits the UserAcceptedAQuery and UserAcceptSpellcheck events when the button is clicked', () => {
    const userAcceptedAQuery = jest.fn();
    const userAcceptSpellcheck = jest.fn();
    const spellcheckedQuery = 'coche';
    const { wrapper, clickEventButton } = renderSpellcheckButton({ spellcheckedQuery });
    const $x = wrapper.vm.$x;

    $x.on('UserAcceptedAQuery').subscribe(userAcceptedAQuery);
    $x.on('UserAcceptedSpellcheckQuery').subscribe(userAcceptSpellcheck);

    clickEventButton();

    expect(userAcceptedAQuery).toHaveBeenNthCalledWith(1, spellcheckedQuery);
    expect(userAcceptSpellcheck).toHaveBeenNthCalledWith(1, spellcheckedQuery);
  });
});

interface RenderSpellcheckButtonOptions {
  /** The template to be rendered. */
  template?: string;
  /** The spellcheckedQuery for the state. */
  spellcheckedQuery?: string;
}

interface RenderSpellcheckButtonAPI {
  /** The wrapper of the container element.*/
  wrapper: Wrapper<Vue>;
  /** Clicks the event button and waits for the view to update. */
  clickEventButton: () => Promise<void>;
}
