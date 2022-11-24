import { mount, Wrapper } from '@vue/test-utils';
import Highlight from '../../highlight.vue';
import { getDataTestSelector } from '../../../__tests__/utils';

function renderHighlight({
  template = '<Highlight v-bind="$attrs"/>',
  text,
  highlight
}: RenderHighlightOptions): RenderHighlightAPI {
  const wrapper = mount(
    {
      inheritAttrs: false,
      components: {
        Highlight
      },
      template
    },
    {
      propsData: {
        text,
        highlight
      }
    }
  );
  const matchingPart = wrapper.find(getDataTestSelector('matching-part'));
  return {
    wrapper,
    matchingPart,
    async setHighlight(highlight) {
      return await wrapper.setProps({ highlight });
    }
  };
}

describe('testing Highlight component', () => {
  it('highlights the rendered text when the match happens at the beginning', () => {
    const { matchingPart, wrapper } = renderHighlight({ text: 'Ibérico', highlight: 'ibe' });
    expect(matchingPart.text()).toEqual('Ibé');
    expect(wrapper.text()).toEqual('Ibérico');
  });
  it('highlights the rendered text when the match happens at the middle', () => {
    const { matchingPart, wrapper } = renderHighlight({ text: 'Picaña', highlight: 'can' });
    expect(matchingPart.text()).toEqual('cañ');
    expect(wrapper.text()).toEqual('Picaña');
  });
  it('highlights the rendered text when the match happens at the end', () => {
    const { matchingPart, wrapper } = renderHighlight({
      text: 'Jamón Ibérico',
      highlight: 'iberico'
    });
    expect(matchingPart.text()).toEqual('Ibérico');
    expect(wrapper.text()).toEqual('Jamón Ibérico');
  });
  it('renders the given text if no match', () => {
    const { matchingPart, wrapper } = renderHighlight({ text: 'vacío', highlight: 'chorizo' });
    expect(matchingPart.exists()).toBe(false);
    expect(wrapper.text()).toEqual('vacío');
  });
  it('allows customising the HTML', async () => {
    const { wrapper, setHighlight } = renderHighlight({
      template: `
        <Highlight v-bind="$attrs" #default="{ hasMatch, start, match, end, text }">
          <span v-if="hasMatch" class="match-custom-layout">
            <strong>{{ start }}</strong>{{ match }}<strong>{{ end }}</strong>
          </span>
          <span v-else class="no-match-custom">{{ text }}</span>
        </Highlight>`,
      text: 'churrasco',
      highlight: 'chur'
    });
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<span class=\\"match-custom-layout\\"><strong></strong>chur<strong>rasco</strong></span>"`
    );

    await setHighlight('no-match');
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<span class=\\"no-match-custom\\">churrasco</span>"`
    );
  });
});

interface RenderHighlightOptions {
  template?: string;
  text: string;
  highlight: string;
}

interface RenderHighlightAPI {
  wrapper: Wrapper<Vue>;
  matchingPart: Wrapper<Vue>;
  setHighlight: (highlight: string) => Promise<void>;
}
