import { mount, Wrapper } from '@vue/test-utils';
import Highlight from '../../highlight.vue';
import { getDataTestSelector } from '../../../__tests__/utils';

function renderHighlight({
  template = '<Highlight v-bind="$attrs"/>',
  text,
  highlight,
  noMatchClass,
  matchingPartClass,
  matchClass
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
        highlight,
        noMatchClass,
        matchingPartClass,
        matchClass
      }
    }
  );
  return {
    wrapper,
    getStartPart() {
      return wrapper.find(getDataTestSelector('highlight-start'));
    },
    getMatchingPart() {
      return wrapper.find(getDataTestSelector('matching-part'));
    },
    getEndPart() {
      return wrapper.find(getDataTestSelector('highlight-end'));
    },
    async setHighlight(highlight) {
      return await wrapper.setProps({ highlight });
    }
  };
}

describe('testing Highlight component', () => {
  it('highlights the rendered text when the match happens at the beginning', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Ibérico',
      highlight: 'ibe'
    });
    expect(wrapper.text()).toEqual('Ibérico');
    expect(getStartPart().exists()).toBe(false);
    expect(getMatchingPart().text()).toEqual('Ibé');
    expect(getEndPart().text()).toBe('rico');
  });

  it('highlights the rendered text when the match happens at the middle', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Picaña',
      highlight: 'can'
    });
    expect(wrapper.text()).toEqual('Picaña');
    expect(getStartPart().text()).toBe('Pi');
    expect(getMatchingPart().text()).toEqual('cañ');
    expect(getEndPart().text()).toBe('a');
  });

  it('highlights the rendered text when the match happens at the end', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Jamón Ibérico',
      highlight: 'iberico'
    });
    expect(wrapper.text()).toEqual('Jamón Ibérico');
    expect(getStartPart().text()).toBe('Jamón');
    expect(getMatchingPart().text()).toEqual('Ibérico');
    expect(getEndPart().exists()).toBe(false);
  });

  it('renders the given text if no match', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'vacío',
      highlight: 'chorizo'
    });
    expect(wrapper.text()).toEqual('vacío');
    expect(getStartPart().text()).toBe('vacío');
    expect(getMatchingPart().exists()).toBe(false);
    expect(getEndPart().exists()).toBe(false);
  });

  it('allows to add classes when the text matches', () => {
    const { getMatchingPart, wrapper } = renderHighlight({
      text: 'salchichón',
      highlight: 'sal',
      matchClass: 'custom-match-class',
      matchingPartClass: 'custom-matching-part-class'
    });
    expect(wrapper.classes('custom-match-class')).toBe(true);
    expect(getMatchingPart().classes('custom-matching-part-class')).toBe(true);
  });

  it('allows to add classes when the text does not match', () => {
    const { wrapper } = renderHighlight({
      text: 'salchichón',
      highlight: 'soy',
      noMatchClass: 'custom-no-match-class'
    });
    expect(wrapper.classes('custom-no-match-class')).toBe(true);
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
  /** The template to render. */
  template?: string;
  /** The text to be highlighted. */
  text: string;
  /** The part of the text to highlight. */
  highlight: string;
  /** Class to add to the root node when the given text doesn't contain the part to highlight. */
  noMatchClass?: string;
  /** Class to add to the node wrapping the matching text. */
  matchingPartClass?: string;
  /** Class to add to the root node when the given text contains the part to highlight. */
  matchClass?: string;
}

interface RenderHighlightAPI {
  /** Testing wrapper component. */
  wrapper: Wrapper<Vue>;
  /** Only the start node wrapper. */
  getStartPart: () => Wrapper<Vue>;
  /** Only the matching node wrapper. */
  getMatchingPart: () => Wrapper<Vue>;
  /** Only the end node wrapper. */
  getEndPart: () => Wrapper<Vue>;
  /** Sets the part of the text to highlight. */
  setHighlight: (highlight: string) => Promise<void>;
}
